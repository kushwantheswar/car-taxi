from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
        ('driver', 'Driver'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=15, blank=True, null=True)

class DriverProfile(models.Model):
    # Decouple from User as login is not required for drivers
    full_name = models.CharField(max_length=100, default="Unknown Driver")
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, default="0000000000")
    age = models.IntegerField(blank=True, null=True)
    license_no = models.CharField(max_length=50, blank=True, null=True)
    license_expiry = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    rating = models.FloatField(default=5.0)
    trips = models.IntegerField(default=0)
    earnings = models.IntegerField(default=0)

    def __str__(self):
        return self.full_name

class Car(models.Model):
    driver = models.ForeignKey(DriverProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='cars')
    brand = models.CharField(max_length=50, default="Toyota")
    model = models.CharField(max_length=50, default="Innova")
    name = models.CharField(max_length=100, blank=True) # Combined name for legacy
    image = models.URLField(blank=True, null=True)
    
    SEAT_CHOICES = ((4, '4 Seater'), (6, '6 Seater'), (7, '7 Seater'))
    seats = models.IntegerField(choices=SEAT_CHOICES, default=4)
    
    CLASS_CHOICES = (('premium', 'Premium'), ('luxury', 'Luxury'), ('standard', 'Standard'))
    tier = models.CharField(max_length=20, choices=CLASS_CHOICES, default='standard')
    
    price_per_km = models.IntegerField(default=15)
    status = models.CharField(max_length=20, default='available')

    def save(self, *args, **kwargs):
        if self.brand and self.model:
            self.name = f"{self.brand} {self.model}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.tier})"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    distance_km = models.FloatField()
    total_price = models.FloatField()
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} - {self.status}"
