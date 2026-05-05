from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import AidRequest
from .serializers import AidRequestSerializer, AidRequestAdminUpdateSerializer


def is_admin_user(user):
    return (
        user.is_authenticated
        and (
            getattr(user, "role", None) == "ADMIN"
            or user.is_staff
            or user.is_superuser
        )
    )


def is_ngo_employee(user):
    return user.is_authenticated and getattr(user, "role", None) == "NGO_EMPLOYEE"


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_aid_request(request):
    """
    Beneficiary creates a new aid request.
    Status will always start as PENDING.
    """

    if getattr(request.user, "role", None) != "BENEFICIARY":
        return Response(
            {"error": "Only beneficiaries can create aid requests."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = AidRequestSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(beneficiary=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ngo_pending_aid_requests(request):
    """
    NGO employees see platform-approved aid requests waiting for NGO review.
    """

    if not is_ngo_employee(request.user):
        return Response(
            {"error": "Only NGO employees can view pending NGO aid requests."},
            status=status.HTTP_403_FORBIDDEN
        )

    aid_requests = AidRequest.objects.filter(
        status='APPROVED',
        ngo_status='PENDING'
    )
    serializer = AidRequestSerializer(aid_requests, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ngo_my_cases(request):
    """
    NGO employees see aid requests they accepted.
    """

    if not is_ngo_employee(request.user):
        return Response(
            {"error": "Only NGO employees can view their accepted aid requests."},
            status=status.HTTP_403_FORBIDDEN
        )

    aid_requests = AidRequest.objects.filter(approved_by_ngo=request.user)
    serializer = AidRequestSerializer(aid_requests, many=True)
    return Response(serializer.data)


@api_view(['PATCH', 'POST'])
@permission_classes([IsAuthenticated])
def ngo_update_aid_request_status(request, pk):
    """
    NGO employees approve or reject platform-approved aid requests.
    """

    if not is_ngo_employee(request.user):
        return Response(
            {"error": "Only NGO employees can update NGO aid request status."},
            status=status.HTTP_403_FORBIDDEN
        )

    aid_request = get_object_or_404(AidRequest, pk=pk)

    if aid_request.status != 'APPROVED' or aid_request.ngo_status != 'PENDING':
        return Response(
            {"error": "Only platform-approved aid requests pending NGO review can be updated."},
            status=status.HTTP_400_BAD_REQUEST
        )

    ngo_status = request.data.get("ngo_status", request.data.get("status"))

    if ngo_status not in ["APPROVED", "REJECTED"]:
        return Response(
            {"error": "ngo_status must be APPROVED or REJECTED."},
            status=status.HTTP_400_BAD_REQUEST
        )

    aid_request.ngo_status = ngo_status
    aid_request.ngo_note = request.data.get("ngo_note", aid_request.ngo_note)

    if ngo_status == "APPROVED":
        aid_request.approved_by_ngo = request.user
        aid_request.ngo_approved_at = timezone.now()
    else:
        aid_request.approved_by_ngo = None
        aid_request.ngo_approved_at = None

    aid_request.save(update_fields=[
        "ngo_status",
        "ngo_note",
        "approved_by_ngo",
        "ngo_approved_at",
        "updated_at",
    ])

    serializer = AidRequestSerializer(aid_request)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_aid_requests(request):
    """
    Beneficiary sees their own aid requests.
    """

    aid_requests = AidRequest.objects.filter(beneficiary=request.user)
    serializer = AidRequestSerializer(aid_requests, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def approved_aid_requests(request):
    """
    Donors, NGOs, volunteers, and users can see aid requests after both
    platform approval and NGO approval.
    """

    aid_requests = AidRequest.objects.filter(
        status='APPROVED',
        ngo_status='APPROVED'
    )
    serializer = AidRequestSerializer(aid_requests, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def aid_request_detail(request, pk):
    """
    View one aid request.
    Admin can see all.
    Beneficiary can see their own.
    Other users can only see requests after both platform and NGO approval.
    """

    aid_request = get_object_or_404(AidRequest, pk=pk)
    is_publicly_approved = (
        aid_request.status == 'APPROVED'
        and aid_request.ngo_status == 'APPROVED'
    )

    if (
        not is_publicly_approved
        and aid_request.beneficiary != request.user
        and not is_admin_user(request.user)
    ):
        return Response(
            {"error": "You do not have permission to view this aid request."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = AidRequestSerializer(aid_request)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_aid_requests(request):
    """
    Admin sees all aid requests.
    """

    if not is_admin_user(request.user):
        return Response(
            {"error": "Only admins can view all aid requests."},
            status=status.HTTP_403_FORBIDDEN
        )

    aid_requests = AidRequest.objects.all()
    serializer = AidRequestSerializer(aid_requests, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_aid_request_status(request, pk):
    """
    Admin approves, rejects, completes, or adds admin note.
    """

    if not is_admin_user(request.user):
        return Response(
            {"error": "Only admins can update aid request status."},
            status=status.HTTP_403_FORBIDDEN
        )

    aid_request = get_object_or_404(AidRequest, pk=pk)
    serializer = AidRequestAdminUpdateSerializer(
        aid_request,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        full_serializer = AidRequestSerializer(aid_request)
        return Response(full_serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_aid_request(request, pk):
    """
    Admin deletes an aid request.
    """

    if not is_admin_user(request.user):
        return Response(
            {"error": "Only admins can delete aid requests."},
            status=status.HTTP_403_FORBIDDEN
        )

    aid_request = get_object_or_404(AidRequest, pk=pk)
    aid_request.delete()

    return Response(
        {"message": "Aid request deleted successfully."},
        status=status.HTTP_200_OK
    )
