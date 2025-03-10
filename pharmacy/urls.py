from django.urls import path
from pharmacy.views import login_view, logout_view, csv_upload, search_medicine

urlpatterns = [
    path("login/", login_view),
    path("logout/", logout_view),
    path("upload_csv/", csv_upload),
    path("search/", search_medicine),
]