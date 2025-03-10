from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
from django.core.exceptions import ObjectDoesNotExist
from .models import Medicine, Pharmacy
from django.contrib.auth.decorators import login_required
from django.db.models import Q 

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = authenticate( username = data["username"], password = data["password"])
        if user:
            login(request, user)
            return JsonResponse({"message": "Logged in successfully!"})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully!"})

@login_required
def csv_upload(request):
    if request.method == "POST" and request.FILES.get("file"):
        pharmacy = Pharmacy.objects.get(user=request.user)
        df = pd.read_csv(request.FILES["file"])

        for _, row in df.iterrows():
            Medicine.objects.update_or_create(
                pharmacy = pharmacy,
                name = row["Medicine Name"],
                defaults={
                    "brand" : row[Brand],
                    "active_ingredient" : row["Active Ingredient"],
                    "quantity" : row["Quantity"],   
                }
            )
        return JsonResponse({"message": "Stock updated successfully!"})
    return JsonResponse({"error": "Invalid request"}, status=400)

def search_medicine(request):
    query = request.GET.get("q", "")
    medicines = Medicine.objects.filter(Q(name__icontains=query) | Q(active_ingredient__icontains=query))

    results = []
    for med in medicines:
        results.append({
            "name" : med.name,
            "brand" : med.brand,    
            "pharmacy" : med.pharmacy.name,
            "address" : med.pharmacy.address,
            "phone" : med.pharmacy.phone,
            "quantity" : med.quantity,
            "online_delivery" : med.pharmacy.online_delivery,
            "whatsapp_link": f"https://wa.me/{med.pharmacy.phone}"
            })
    return JsonResponse({"results": results})