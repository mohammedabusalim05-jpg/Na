from rest_framework.permissions import BasePermission


class IsNGO(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["NGO", "NGO_EMPLOYEE"]
        )


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role == "ADMIN"
                or request.user.is_staff
                or request.user.is_superuser
            )
        )


class IsVolunteer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "VOLUNTEER"
        )
