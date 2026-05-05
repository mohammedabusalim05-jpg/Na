from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from datetime import timedelta
import uuid

from .serializers import RegisterSerializer
from .serializers_profile import UserDetailSerializer


class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAdminUser]


class UserDeleteView(generics.DestroyAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminListView(generics.ListAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        User = get_user_model()
        return User.objects.filter(is_staff=True) | User.objects.filter(is_superuser=True)


@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def create_admin_view(request):
    User = get_user_model()
    data = request.data

    email = data.get("email")
    password = data.get("password")
    first_name = data.get("name", "Admin")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_superuser(
            email=email,
            username=email,
            password=password,
            first_name=first_name
        )
        return Response({"message": "Admin created successfully", "id": user.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminDeleteView(generics.DestroyAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User created successfully",
            "user": {
                "email": user.email,
                "role": user.role,
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "user_name": user.first_name if user.first_name else user.email.split("@")[0],
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    print(f"LOGIN REQUEST RECEIVED. Data: {request.data}")

    try:
        email = request.data.get("email")
        password = request.data.get("password")

        User = get_user_model()

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            print(f"AUTH FAIL: Password mismatch for {email}")
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"error": "User account is disabled"}, status=status.HTTP_401_UNAUTHORIZED)

        print(f"AUTH SUCCESS: Logged in as {user.email}")

        refresh = RefreshToken.for_user(user)

        if user.is_staff or user.is_superuser or user.role == "ADMIN":
            role = "admin"
        else:
            role = user.role

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": role,
            "user_name": user.first_name if user.first_name else user.email.split("@")[0],
        }, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": f"Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def guest_view(request):
    try:
        from rest_framework_simplejwt.tokens import AccessToken

        token = AccessToken()
        token.set_exp(lifetime=timedelta(minutes=30))

        token["user_id"] = str(uuid.uuid4())
        token["is_guest"] = True

        return Response({
            "access": str(token),
            "expires_in": 1800,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Guest Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([AllowAny])
def test_view(request):
    return Response({"message": "API working correctly"}, status=status.HTTP_200_OK)
# ========================================================
# CHANGE PASSWORD
# ========================================================
from django.contrib.auth.password_validation import validate_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if not current_password or not new_password or not confirm_password:
        return Response(
            {"error": "Current password, new password, and confirm password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if new_password != confirm_password:
        return Response(
            {"error": "New password and confirm password do not match."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not request.user.check_password(current_password):
        return Response(
            {"error": "Current password is incorrect."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        validate_password(new_password, request.user)
    except Exception as e:
        return Response(
            {"error": list(e.messages) if hasattr(e, "messages") else str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

    request.user.set_password(new_password)
    request.user.save()

    return Response(
        {"message": "Password changed successfully. Please login again."},
        status=status.HTTP_200_OK
    )
