from django.db import models
from django.contrib.auth.models import User

class Pharmacy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Allow multiple pharmacies per user
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    online_delivery = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Medicine(models.Model):
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    active_ingredient = models.CharField(max_length=1000)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.brand} - {self.pharmacy.name})"
