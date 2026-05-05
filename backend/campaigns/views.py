from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsNGO, IsAdmin
from .models import Campaign


def campaign_to_dict(campaign):
    return {
        "id": str(campaign.id),
        "title": campaign.title,
        "description": campaign.description,
        "status": campaign.status,
        "ngo": campaign.ngo.email if campaign.ngo else None,
        "created_at": campaign.created_at,
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_approved_campaigns(request):
    campaigns = Campaign.objects.filter(status="Approved").order_by("-created_at")
    data = [campaign_to_dict(campaign) for campaign in campaigns]
    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsNGO])
def create_campaign(request):
    campaign = Campaign.objects.create(
        title=request.data.get("title"),
        description=request.data.get("description", ""),
        ngo=request.user
    )
    return Response(campaign_to_dict(campaign))


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsNGO])
def submit_campaign(request, id):
    campaign = Campaign.objects.get(id=id, ngo=request.user)
    campaign.status = "PendingVerification"
    campaign.save()
    return Response(campaign_to_dict(campaign))


@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def review_campaign(request, id):
    campaign = Campaign.objects.get(id=id)
    campaign.status = request.data.get("status")
    campaign.save()
    return Response(campaign_to_dict(campaign))