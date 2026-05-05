from django.urls import path
from .views import (
    DonationListView,
    MyDonationsView,
    NgoAssignedDonationsView,
    NgoSupportedCategoriesView,
    NGOsByDonationCategoryView,
    DonationCreateView,
    DonationByTypeView,
    DonationDetailView,
    DonationRequestCreateView,
    dashboard_donations_stats,
    dashboard_requests_stats,
    PendingDonationRequestsView,
    DonationRequestUpdateView,
    DonationRequestDeleteView,
)

urlpatterns = [
    # ========================
    # STATIC PATHS FIRST
    # ========================

    # Donations
    path("", DonationListView.as_view(), name="donation-list"),
    path("my/", MyDonationsView.as_view(), name="my-donations"),
    path("ngo/my/", NgoAssignedDonationsView.as_view(), name="ngo-assigned-donations"),
    path(
        "ngo/supported-categories/",
        NgoSupportedCategoriesView.as_view(),
        name="ngo-supported-categories"
    ),
    path("create/", DonationCreateView.as_view(), name="donation-create"),
    path("stats/", dashboard_donations_stats, name="dashboard-donations-stats"),
    path(
        "categories/<str:donation_type>/ngos/",
        NGOsByDonationCategoryView.as_view(),
        name="ngos-by-donation-category"
    ),

    # Requests
    path("requests/create/", DonationRequestCreateView.as_view(), name="request-create"),
    path("requests/stats/", dashboard_requests_stats, name="dashboard-requests-stats"),
    path("requests/pending/", PendingDonationRequestsView.as_view(), name="request-pending"),
    path("requests/<int:pk>/update/", DonationRequestUpdateView.as_view(), name="request-update"),
    path("requests/<int:pk>/delete/", DonationRequestDeleteView.as_view(), name="request-delete"),

    # ========================
    # DYNAMIC PATHS LAST
    # ========================
    path("type/<str:donation_type>/", DonationByTypeView.as_view(), name="donation-by-type"),
    path("<int:pk>/", DonationDetailView.as_view(), name="donation-detail"),
]
