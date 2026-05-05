from django.urls import path
from .views import my_notifications
from .views import unread_count
from .views import mark_as_read

urlpatterns = [
    path("my/", my_notifications),
    path("unread-count/", unread_count),
    path("<uuid:id>/read/", mark_as_read),




]
