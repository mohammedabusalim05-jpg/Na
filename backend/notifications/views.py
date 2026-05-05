from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    qs = Notification.objects.filter(user=request.user).order_by("-created_at")
    data = [
        {
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at
        }
        for n in qs
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()

    return Response({"unread": count})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_as_read(request, id):
    notification = Notification.objects.get(
        id=id,
        user=request.user
    )
    notification.is_read = True
    notification.save()
    return Response({"status": "read"})
