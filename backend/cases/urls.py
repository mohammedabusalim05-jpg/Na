from django.urls import path
from . import views

urlpatterns = [
    path('', views.approved_aid_requests, name='approved-aid-requests'),
    path('create/', views.create_aid_request, name='create-aid-request'),
    path('my/', views.my_aid_requests, name='my-aid-requests'),

    path('ngo/pending/', views.ngo_pending_aid_requests, name='ngo-pending-aid-requests'),
    path('ngo/my-cases/', views.ngo_my_cases, name='ngo-my-cases'),
    path('ngo/<int:pk>/status/', views.ngo_update_aid_request_status, name='ngo-update-aid-request-status'),

    path('admin/all/', views.admin_all_aid_requests, name='admin-all-aid-requests'),
    path('admin/<int:pk>/status/', views.admin_update_aid_request_status, name='admin-update-aid-request-status'),
    path('admin/<int:pk>/delete/', views.admin_delete_aid_request, name='admin-delete-aid-request'),

    path('<int:pk>/', views.aid_request_detail, name='aid-request-detail'),
]
