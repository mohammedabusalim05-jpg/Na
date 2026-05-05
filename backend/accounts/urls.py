from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register_view,
    login_view,
    guest_view,
    UserDetailView,
    UserListView,
    UserDeleteView,
    AdminListView,
    create_admin_view,
    AdminDeleteView,
    change_password,
)

urlpatterns = [
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("profile/", UserDetailView.as_view(), name="profile"),
    path("change-password/", change_password, name="change_password"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("guest/", guest_view, name="guest"),
    path("users/", UserListView.as_view(), name="user_list"),
    path("users/<int:pk>/", UserDeleteView.as_view(), name="user_delete"),
    path("admins/", AdminListView.as_view(), name="admin_list"),
    path("admins/create/", create_admin_view, name="admin_create"),
    path("admins/<int:pk>/", AdminDeleteView.as_view(), name="admin_delete"),
]