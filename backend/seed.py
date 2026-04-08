"""
Seed script: Creates admin user, 15 drivers, and 15 cars.
Run with: python seed.py  (from backend/ directory with venv active)
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from api.models import User, DriverProfile, Car

# --- Create Admin ---
admin, _ = User.objects.get_or_create(username='admin', defaults={
    'password': make_password('admin123'),
    'role': 'admin',
    'email': 'admin@cartaxi.in',
    'is_staff': True,
})
print(f"✓ Admin: admin / admin123")

# --- 15 Drivers ---
driver_data = [
    ("Ravi Kumar",     "9876543201", "driver1",  "premium"),
    ("Suresh Babu",    "9876543202", "driver2",  "luxury"),
    ("Anil Reddy",     "9876543203", "driver3",  "standard"),
    ("Venkat Rao",     "9876543204", "driver4",  "premium"),
    ("Krishna Prasad", "9876543205", "driver5",  "standard"),
    ("Manoj Varma",    "9876543206", "driver6",  "luxury"),
    ("Srinivas Goud",  "9876543207", "driver7",  "standard"),
    ("Prasad Nair",    "9876543208", "driver8",  "premium"),
    ("Rajesh Sharma",  "9876543209", "driver9",  "standard"),
    ("Vikram Singh",   "9876543210", "driver10", "luxury"),
    ("Harish Yadav",   "9876543211", "driver11", "standard"),
    ("Deepak Mishra",  "9876543212", "driver12", "premium"),
    ("Santosh Pillai", "9876543213", "driver13", "standard"),
    ("Naveen Reddy",   "9876543214", "driver14", "luxury"),
    ("Kiran Babu",     "9876543215", "driver15", "standard"),
]

created_drivers = []
for name, phone, uname, tier in driver_data:
    user, _ = User.objects.get_or_create(username=uname, defaults={
        'password': make_password('driver123'),
        'role': 'driver',
        'phone': phone,
        'first_name': name.split()[0],
        'last_name': ' '.join(name.split()[1:]),
    })
    dp, _ = DriverProfile.objects.get_or_create(user=user, defaults={'is_available': True, 'rating': round(3.8 + (ord(uname[-1]) % 12) * 0.1, 1)})
    created_drivers.append(dp)
    print(f"✓ Driver: {name} ({uname})")

# --- 15 Cars ---
car_data = [
    ("Toyota Innova Crysta", 7, "premium", 22, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/40432/innova-crysta-exterior-right-front-three-quarter-2.jpeg"),
    ("Maruti Suzuki Swift",  4, "standard", 12, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/159089/swift-exterior-right-front-three-quarter-57.jpeg"),
    ("Honda City Sedan",     4, "premium",  18, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/134297/city-exterior-right-front-three-quarter-4.jpeg"),
    ("BMW 5 Series",         4, "luxury",   55, "https://images.zigwheels.com/medias/assets/3/222/listing-BMW-5-Series.jpg"),
    ("Toyota Camry",         4, "luxury",   48, "https://images.zigwheels.com/medias/assets/1/1613/listing-Toyota-Camry.jpg"),
    ("Mahindra Scorpio N",   7, "premium",  20, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/40087/scorpio-n-exterior-right-front-three-quarter-2.jpeg"),
    ("Tata Nexon",           4, "standard", 13, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/141115/nexon-exterior-right-front-three-quarter.jpeg"),
    ("Mercedes E-Class",     4, "luxury",   60, "https://images.zigwheels.com/medias/assets/1/16985/listing-Mercedes-Benz-E-Class.jpg"),
    ("Hyundai Verna",        4, "standard", 14, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/132583/verna-exterior-right-front-three-quarter-6.jpeg"),
    ("Kia Carens",           6, "premium",  21, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/155603/carens-exterior-right-front-three-quarter.jpeg"),
    ("Force Traveller",      12,"premium",  19, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/82455/traveller-exterior-right-front-three-quarter.jpeg"),
    ("Audi A6",              4, "luxury",   58, "https://images.zigwheels.com/medias/assets/1/1/listing-Audi-A6.jpg"),
    ("Maruti Ertiga",        7, "standard", 14, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/45773/ertiga-exterior-right-front-three-quarter-4.jpeg"),
    ("Hyundai Tucson",       4, "premium",  24, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/161671/tucson-exterior-right-front-three-quarter-4.jpeg"),
    ("Toyota Fortuner",      7, "luxury",   38, "https://imgd.aeplcdn.com/1200x900/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-4.jpeg"),
]

for i, (name, seats, tier, price, img) in enumerate(car_data):
    driver = created_drivers[i] if i < len(created_drivers) else None
    car, created = Car.objects.get_or_create(name=name, defaults={
        'driver': driver,
        'seats': min(seats, 7),
        'tier': tier,
        'price_per_km': price,
        'image': img,
        'status': 'available',
    })
    if created:
        print(f"✓ Car: {name} ({tier}, ₹{price}/km)")
    else:
        print(f"  Car already exists: {name}")

print("\n🎉 Seeding complete! 15 cars + 15 drivers created.")
print("Admin login → username: admin | password: admin123")
