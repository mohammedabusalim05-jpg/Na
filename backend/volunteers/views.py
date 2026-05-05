from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsVolunteer, IsAdmin
from .models import VolunteerApplication
from notifications.models import Notification


def application_to_dict(app):
    return {
        "id": str(app.id),
        "volunteer": app.volunteer.email,
        "campaign_id": str(app.campaign.id),
        "campaign": app.campaign.title,
        "campaign_description": app.campaign.description,
        "status": app.status,
        "created_at": app.created_at,
    }


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVolunteer])
def submit_application(request):
    campaign_id = request.data.get("campaign_id")

    if not campaign_id:
        return Response({"error": "campaign_id is required."}, status=400)

    existing = VolunteerApplication.objects.filter(
        volunteer=request.user,
        campaign_id=campaign_id
    ).first()

    if existing:
        return Response(
            {
                "error": "You already applied to this campaign.",
                "application": application_to_dict(existing),
            },
            status=400
        )

    app = VolunteerApplication.objects.create(
        volunteer=request.user,
        campaign_id=campaign_id,
        status="UNDER_REVIEW"
    )

    return Response(application_to_dict(app), status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsVolunteer])
def my_applications(request):
    apps = VolunteerApplication.objects.filter(
        volunteer=request.user
    ).select_related("campaign").order_by("-created_at")

    data = [application_to_dict(app) for app in apps]
    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def open_application(request, id):
    app = VolunteerApplication.objects.get(id=id)
    app.status = "UNDER_REVIEW"
    app.save()
    return Response(application_to_dict(app))


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def approve_application(request, id):
    app = VolunteerApplication.objects.get(id=id)
    app.status = "APPROVED"
    app.save()

    Notification.objects.create(
        user=app.volunteer,
        message="Your volunteer application has been APPROVED."
    )

    return Response(application_to_dict(app))


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def reject_application(request, id):
    app = VolunteerApplication.objects.get(id=id)
    app.status = "REJECTED"
    app.save()

    Notification.objects.create(
        user=app.volunteer,
        message="Your volunteer application has been REJECTED."
    )

    return Response(application_to_dict(app))


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVolunteer])
def join_task(request, id):
    app = VolunteerApplication.objects.get(id=id, volunteer=request.user)
    app.status = "ACTIVE"
    app.save()
    return Response(application_to_dict(app))


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVolunteer])
def finish_task(request, id):
    app = VolunteerApplication.objects.get(id=id, volunteer=request.user)
    app.status = "COMPLETED"
    app.save()
    return Response(application_to_dict(app))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_application(request, id):
    app = VolunteerApplication.objects.get(id=id)

    if app.volunteer != request.user and not request.user.is_staff:
        return Response(
            {"error": "You do not have permission to cancel this application."},
            status=403
        )

    app.status = "CANCELLED"
    app.save()
    return Response(application_to_dict(app))


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def list_under_review(request):
    qs = VolunteerApplication.objects.filter(
        status="UNDER_REVIEW"
    ).select_related("volunteer", "campaign").order_by("-created_at")

    data = [application_to_dict(app) for app in qs]
    return Response(data)