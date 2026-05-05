from django.urls import path
from .views import *

urlpatterns = [
    # Volunteer actions
    path("apply/", submit_application),
    path("my-applications/", my_applications),

    path("<uuid:id>/open/", open_application),
    path("<uuid:id>/approve/", approve_application),
    path("<uuid:id>/reject/", reject_application),
    path("<uuid:id>/join/", join_task),
    path("<uuid:id>/finish/", finish_task),
    path("<uuid:id>/cancel/", cancel_application),

    # Admin dashboard
    path("admin/under-review/", list_under_review),
]