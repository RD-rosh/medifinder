from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
from django.core.exceptions import ObjectDoesNotExist
from .models import Medicine, Pharmacy
from django.contrib.auth.decorators import login_required
from django.db.models import Q 
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token


@csrf_exempt
def login_view(request):
    print("Request method:", request.method)
    if request.method == "POST":
        data = json.loads(request.body)
        print("Request body:", data)
        user = authenticate( username = data["username"], password = data["password"])
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            login(request, user)
            print("token", token.key)
            return JsonResponse({"accessToken": token.key, "user": {"id": user.id, "username": user.username}})
    
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully!"})

@csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def csv_upload(request):
    print("Request received:", request.method)
    print("User:", request.user)
    print("Files:", request.FILES)

    if request.FILES.get("file"):
        try:
            pharmacy = Pharmacy.objects.get(user=request.user)
            df = pd.read_csv(request.FILES["file"])
            
            for _, row in df.iterrows():
                Medicine.objects.update_or_create(
                    pharmacy=pharmacy,
                    name=row["Medicine Name"],
                    defaults={
                        "brand": row["Brand"],
                        "active_ingredient": row["Active Ingredient"],
                        "quantity": row["Quantity"],
                    }
                )
            return JsonResponse({"message": "Stock updated successfully!"})
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "No file provided"}, status=400)

@csrf_exempt
def get_pharmacy_medicines(request, pharmacy_id):
    if request.method == "GET":
        medicines = Medicine.objects.filter(pharmacy_id=pharmacy_id).values()
        return JsonResponse(list(medicines), safe=False)

    return JsonResponse({"error": "Invalid method"}, status=405)

def search_medicine(request):
    query = request.GET.get("search", "").strip()

    medicines = Medicine.objects.filter(
        Q(name__icontains=query) |
        Q(brand__icontains=query) |  
        Q(active_ingredient__icontains=query)
        )

    results = []
    for med in medicines:
        results.append({
            "name": med.name,
            "brand": med.brand,    
            "pharmacy": med.pharmacy.name,
            "address": med.pharmacy.address,
            "phone": med.pharmacy.phone,
            "quantity": med.quantity,
            "online_delivery": med.pharmacy.online_delivery,
            "whatsapp_link": f"https://wa.me/{med.pharmacy.phone}"
        })
    return JsonResponse({"results": results})

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data["username"]
            password = data["password"]
            email = data.get("email", "")

            user = User.objects.create_user(username=username, email=email, password=password)

            if "pharmacy_name" in data:
                Pharmacy.objects.create(
                    user=user,
                    name=data["pharmacy_name"],
                    address=data.get("address", ""),
                    phone=data.get("phone", ""),
                    online_delivery=data.get("online_delivery", False),
                )

            return JsonResponse({"message": "User registered successfully!"})
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)

#@csrf_exempt
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_pharmacies(request):
    if request.method == "GET":
        user = request.user
        print(f"Debug: Authenticated user - {user}") 
        if not user.is_authenticated:
            return JsonResponse({"error": "User not authenticated"}, status=401)

        pharmacies = Pharmacy.objects.filter(user=user).values("id", "name")
        return JsonResponse(list(pharmacies), safe=False)

    return JsonResponse({"error": "Invalid method"}, status=405)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_pharmacy(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            pharmacy = Pharmacy.objects.create(
                user=request.user,
                name=data["pharmacy_name"],
                address=data.get("address", ""),
                phone=data.get("phone", ""),
                online_delivery=data.get("online_delivery", False)
            )
            
            return JsonResponse({
                "message": "Pharmacy added successfully!",
                "pharmacy": {
                    "id": pharmacy.id,
                    "name": pharmacy.name
                }
            })
            
        except KeyError as e:
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)