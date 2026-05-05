from django.urls import path
from .views import (
    create_campaign,
    submit_campaign,
    review_campaign,
    list_approved_campaigns,
)

urlpatterns = [
    path("approved/", list_approved_campaigns),
    path("create/", create_campaign),
    path("<uuid:id>/submit/", submit_campaign),
    path("<uuid:id>/review/", review_campaign),
]