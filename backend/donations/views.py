from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.db import transaction
import logging

from cases.models import AidRequest
from notifications.models import Notification
from .models import Donation, DonationRequest, NGOCategory
from .serializers import (
    DonationSerializer,
    DonationCreateSerializer,
    DonationRequestSerializer,
    NGOCategorySerializer
)


logger = logging.getLogger(__name__)

# =========================
# DONATIONS
# =========================

# ✔ عرض جميع التبرعات
# Used for public browsing/admin display, not personal history.
class DonationListView(generics.ListAPIView):
    queryset = Donation.objects.all().order_by("-created_at")
    serializer_class = DonationSerializer
    permission_classes = [permissions.AllowAny]


# ✔ عرض تبرعات المستخدم الحالي فقط
# Used by My Impact History so users do not see other users' donations.
class MyDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


class NgoAssignedDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) != "NGO_EMPLOYEE":
            raise PermissionDenied("Only NGO employees can view assigned donations.")

        return Donation.objects.filter(
            assigned_ngo=user
        ).order_by("-created_at")


class NGOsByDonationCategoryView(generics.ListAPIView):
    serializer_class = NGOCategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return NGOCategory.objects.select_related("ngo").filter(
            donation_type=self.kwargs.get("donation_type"),
            is_active=True
        ).order_by("display_name", "ngo__email")


class NgoSupportedCategoriesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _ensure_ngo_employee(self, request):
        if getattr(request.user, "role", None) != "NGO_EMPLOYEE":
            raise PermissionDenied("Only NGO employees can manage supported donation categories.")

    def _serialize_categories(self, user):
        mappings = {
            item.donation_type: item
            for item in NGOCategory.objects.filter(ngo=user)
        }

        categories = []
        for donation_type, label in Donation.DONATION_TYPES:
            mapping = mappings.get(donation_type)
            categories.append({
                "donation_type": donation_type,
                "label": label,
                "is_supported": bool(mapping and mapping.is_active),
                "mapping_id": mapping.id if mapping else None,
                "display_name": mapping.display_name if mapping else "",
                "description": mapping.description if mapping else "",
            })

        return categories

    def get(self, request):
        self._ensure_ngo_employee(request)
        return Response(self._serialize_categories(request.user))

    def put(self, request):
        return self._update_categories(request)

    def patch(self, request):
        return self._update_categories(request)

    def _update_categories(self, request):
        self._ensure_ngo_employee(request)

        donation_types = request.data.get("donation_types", [])
        valid_types = {choice[0] for choice in Donation.DONATION_TYPES}

        if not isinstance(donation_types, list):
            return Response(
                {"donation_types": "Expected a list of donation type values."},
                status=status.HTTP_400_BAD_REQUEST
            )

        selected_types = set(donation_types)
        invalid_types = sorted(selected_types - valid_types)

        if invalid_types:
            return Response(
                {"donation_types": f"Invalid donation type values: {', '.join(invalid_types)}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            NGOCategory.objects.filter(
                ngo=request.user
            ).exclude(
                donation_type__in=selected_types
            ).update(is_active=False)

            for donation_type in selected_types:
                NGOCategory.objects.update_or_create(
                    ngo=request.user,
                    donation_type=donation_type,
                    defaults={"is_active": True}
                )

        return Response(self._serialize_categories(request.user))


# ✔ إنشاء تبرع جديد (User / Guest)
class DonationCreateView(generics.CreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationCreateSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        aid_request = serializer.validated_data.get("aid_request")

        with transaction.atomic():
            if aid_request:
                aid_request = AidRequest.objects.select_for_update().get(pk=aid_request.pk)
                remaining_amount = aid_request.remaining_amount()
                amount = serializer.validated_data.get("amount")

                if aid_request.status == "COMPLETED" or remaining_amount <= 0:
                    raise ValidationError(
                        {"aid_request_id": "This aid request is already fully funded."}
                    )

                if aid_request.status != "APPROVED" or aid_request.ngo_status != "APPROVED":
                    raise ValidationError(
                        {
                            "aid_request_id": (
                                "Donations can only be linked to published NGO-approved cases."
                            )
                        }
                    )

                if amount > remaining_amount:
                    raise ValidationError(
                        {
                            "amount": (
                                f"Only {remaining_amount} JOD is remaining for this aid request."
                            )
                        }
                    )

            assigned_ngo = (
                aid_request.approved_by_ngo
                if aid_request
                else serializer.validated_data.get("assigned_ngo")
            )

            donation = serializer.save(
                user=user,
                aid_request=aid_request,
                assigned_ngo=assigned_ngo,
                approved_by_ngo=True,
                is_completed=False
            )

            if aid_request and aid_request.is_fully_funded():
                aid_request.status = "COMPLETED"
                aid_request.save(update_fields=["status", "updated_at"])

        if user:
            Notification.objects.create(
                user=user,
                message=f"Your donation '{donation.title}' was created successfully."
            )


# ✔ تفاصيل / تعديل / حذف تبرع
class DonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_update(self, serializer):
        old = self.get_object()
        donation = serializer.save()

        # 🔔 إشعار عند تغيير حالة التبرع
        if old.is_completed != donation.is_completed and donation.user:
            status = "completed" if donation.is_completed else "pending"

            Notification.objects.create(
                user=donation.user,
                message=f"Your donation '{donation.title}' was marked as {status}."
            )


# ✔ عرض التبرعات حسب النوع
class DonationByTypeView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Donation.objects.filter(
            donation_type=self.kwargs.get("donation_type")
        ).order_by("-created_at")


# =========================
# DONATION REQUESTS
# =========================

# ✔ إنشاء طلب مساعدة
class DonationRequestCreateView(generics.CreateAPIView):
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


# ✔ عرض الطلبات المعلّقة فقط
class PendingDonationRequestsView(generics.ListAPIView):
    serializer_class = DonationRequestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return DonationRequest.objects.filter(
            status="pending"
        ).order_by("-created_at")


# ✔ تعديل حالة الطلب
class DonationRequestUpdateView(generics.UpdateAPIView):
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_update(self, serializer):
        old = self.get_object()
        request_obj = serializer.save()

        if old.status != request_obj.status and request_obj.user:
            Notification.objects.create(
                user=request_obj.user,
                message=f"Your help request was {request_obj.status}."
            )


# ✔ حذف الطلب
class DonationRequestDeleteView(generics.DestroyAPIView):
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer
    permission_classes = [permissions.IsAdminUser]


# =========================
# DASHBOARD – DONATIONS
# =========================
@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def dashboard_donations_stats(request):
    User = get_user_model()
    approved_donations = Donation.objects.filter(approved_by_ngo=True)

    return Response({
        "total_users": User.objects.count(),
        "total_donations": Donation.objects.count(),
        "active_cases": approved_donations.filter(is_completed=False).count(),
        "recent_donations": DonationSerializer(
            approved_donations.order_by("-created_at")[:5],
            many=True
        ).data,
        "donations_by_category": [
            {"name": item["donation_type"], "value": item["count"]}
            for item in Donation.objects
            .values("donation_type")
            .annotate(count=Count("id"))
        ],
    })


# =========================
# DASHBOARD – REQUESTS
# =========================
@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def dashboard_requests_stats(request):
    return Response({
        "total_requests": DonationRequest.objects.count(),
        "pending_requests": DonationRequest.objects.filter(status="pending").count(),
        "approved_requests": DonationRequest.objects.filter(status="approved").count(),
        "rejected_requests": DonationRequest.objects.filter(status="rejected").count(),
        "recent_requests": DonationRequestSerializer(
            DonationRequest.objects.order_by("-created_at")[:5],
            many=True
        ).data,
    })
