from django.urls import path
from pharmacy.views import signup_view, login_view, logout_view, csv_upload, search_medicine, get_pharmacy_medicines, get_user_pharmacies


urlpatterns = [
    path("auth/login/", login_view),
    path("auth/logout/", logout_view),
    path("auth/signup/", signup_view),
    path("auth/upload_csv/", csv_upload),
    path("auth/medicines/<int:pharmacy_id>/",get_pharmacy_medicines),
    path("search/", search_medicine),
    path("auth/user/pharmacies/", get_user_pharmacies),
]