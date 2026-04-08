export const CARS = [
  {
    id: 1, name: "Toyota Innova Crysta", type: "6-seater", tier: "standard",
    plate: "AP 09 XY 1234", driver: "Ravi Kumar", driverPhone: "9876543210",
    driverRating: 4.7, driverTrips: 234, driverAvatar: "RK",
    pricePerKm: 14, status: "available", emoji: "🚐", fuel: "Diesel", year: 2022,
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&q=80",
    seats: 6, ac: true, gps: true, description: "Spacious & reliable family MPV"
  },
  {
    id: 2, name: "Maruti Swift Dzire", type: "4-seater", tier: "standard",
    plate: "AP 09 AB 5678", driver: "Srinivas Rao", driverPhone: "9988776655",
    driverRating: 4.5, driverTrips: 189, driverAvatar: "SR",
    pricePerKm: 11, status: "available", emoji: "🚗", fuel: "Petrol", year: 2023,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80",
    seats: 4, ac: true, gps: false, description: "Efficient & comfortable city sedan"
  },
  {
    id: 3, name: "Toyota Fortuner", type: "6-seater", tier: "premium",
    plate: "AP 09 CD 9012", driver: "Vijay Reddy", driverPhone: "9123456789",
    driverRating: 4.9, driverTrips: 412, driverAvatar: "VR",
    pricePerKm: 22, status: "available", emoji: "🚙", fuel: "Diesel", year: 2023,
    image: "https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=400&q=80",
    seats: 6, ac: true, gps: true, description: "Premium SUV with commanding presence"
  },
  {
    id: 4, name: "BMW 5 Series", type: "4-seater", tier: "luxury",
    plate: "AP 09 EF 3456", driver: "Anil Sharma", driverPhone: "9234567890",
    driverRating: 5.0, driverTrips: 98, driverAvatar: "AS",
    pricePerKm: 45, status: "available", emoji: "🏎", fuel: "Petrol", year: 2024,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
    seats: 4, ac: true, gps: true, description: "Ultimate luxury executive sedan"
  },
  {
    id: 5, name: "Honda City", type: "4-seater", tier: "standard",
    plate: "AP 09 GH 7890", driver: "Kiran Naidu", driverPhone: "9345678901",
    driverRating: 4.6, driverTrips: 301, driverAvatar: "KN",
    pricePerKm: 13, status: "on_trip", emoji: "🚗", fuel: "Petrol", year: 2022,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=400&q=80",
    seats: 4, ac: true, gps: true, description: "Smooth & stylish premium sedan"
  },
];

export const BOOKINGS = [
  { id: "BK001", user: "Priya Nair", userPhone: "9876543210", car: "Toyota Fortuner", carId: 3, from: "MG Road, Vijayawada", to: "Guntur Bus Stand", fromKm: 12450, toKm: 12482, km: 32, status: "completed", date: "2025-01-10", time: "09:30", amount: 704, tax: 35, driver: "Vijay Reddy", driverPhone: "9123456789", rating: 5 },
  { id: "BK002", user: "Ramesh Chowdary", userPhone: "9234567890", car: "BMW 5 Series", carId: 4, from: "Benz Circle", to: "Amaravati Capital", fromKm: 28100, toKm: 28118, km: 18, status: "active", date: "2025-01-11", time: "14:00", amount: 810, tax: 41, driver: "Anil Sharma", driverPhone: "9234567890", rating: null },
  { id: "BK003", user: "Lakshmi Devi", userPhone: "9345678901", car: "Maruti Swift Dzire", carId: 2, from: "Eluru Road", to: "Kondapalli", fromKm: 45600, toKm: 45614, km: 14, status: "pending", date: "2025-01-11", time: "16:00", amount: 154, tax: 8, driver: "Srinivas Rao", driverPhone: "9988776655", rating: null },
  { id: "BK004", user: "Sai Teja", userPhone: "9456789012", car: "Kia Carens", carId: 6, from: "Auto Nagar", to: "Undavalli Caves", fromKm: 8900, toKm: 8909, km: 9, status: "completed", date: "2025-01-09", time: "11:00", amount: 162, tax: 8, driver: "Suresh Babu", driverPhone: "9456789012", rating: 4 },
  { id: "BK005", user: "Meera Krishnan", userPhone: "9567890123", car: "Mercedes S-Class", carId: 7, from: "Vijayawada Airport", to: "Rajahmundry", fromKm: 52300, toKm: 52384, km: 84, status: "completed", date: "2025-01-08", time: "08:00", amount: 5880, tax: 294, driver: "Raj Gupta", driverPhone: "9567890123", rating: 5 },
  { id: "BK006", user: "Sunil Kumar", userPhone: "9678901234", car: "Toyota Innova Crysta", carId: 1, from: "One Town", to: "Krishna District", fromKm: 31200, toKm: 31258, km: 58, status: "cancelled", date: "2025-01-07", time: "07:30", amount: 812, tax: 41, driver: "Ravi Kumar", driverPhone: "9876543210", rating: null },
];

export const DRIVERS = [
  { id: 1, name: "Ravi Kumar", phone: "9876543210", email: "ravi@cartaxi.in", license: "AP2023DL001", licenseExpiry: "2026-12-31", car: "Toyota Innova Crysta", carId: 1, rating: 4.7, trips: 234, earnings: 42800, status: "available", joinDate: "2022-03-15", age: 34, address: "Labbipet, Vijayawada" },
  { id: 2, name: "Srinivas Rao", phone: "9988776655", email: "srini@cartaxi.in", license: "AP2022DL045", licenseExpiry: "2025-08-20", car: "Maruti Swift Dzire", carId: 2, rating: 4.5, trips: 189, earnings: 28400, status: "available", joinDate: "2022-07-01", age: 28, address: "Governorpet, Vijayawada" },
  { id: 3, name: "Vijay Reddy", phone: "9123456789", email: "vijay@cartaxi.in", license: "AP2021DL033", licenseExpiry: "2027-03-15", car: "Toyota Fortuner", carId: 3, rating: 4.9, trips: 412, earnings: 98600, status: "on_trip", joinDate: "2021-01-10", age: 38, address: "Suryaraopet, Vijayawada" },
  { id: 4, name: "Anil Sharma", phone: "9234567890", email: "anil@cartaxi.in", license: "AP2023DL078", licenseExpiry: "2026-06-30", car: "BMW 5 Series", carId: 4, rating: 5.0, trips: 98, earnings: 62400, status: "on_trip", joinDate: "2023-06-15", age: 42, address: "Benz Circle, Vijayawada" },
  { id: 5, name: "Kiran Naidu", phone: "9345678901", email: "kiran@cartaxi.in", license: "AP2022DL091", licenseExpiry: "2025-11-10", car: "Honda City", carId: 5, rating: 4.6, trips: 301, earnings: 54200, status: "on_trip", joinDate: "2022-02-20", age: 31, address: "Patamata, Vijayawada" },
];

export const REVENUE_DATA = [
  { month: "Aug", revenue: 48000, bookings: 142, km: 3240 },
  { month: "Sep", revenue: 52000, bookings: 158, km: 3890 },
  { month: "Oct", revenue: 61000, bookings: 184, km: 4420 },
  { month: "Nov", revenue: 58000, bookings: 172, km: 4100 },
  { month: "Dec", revenue: 74000, bookings: 221, km: 5180 },
  { month: "Jan", revenue: 68000, bookings: 198, km: 4750 },
];

export const LOCATIONS = [
  "MG Road, Vijayawada", "Benz Circle, Vijayawada", "Vijayawada Railway Station",
  "Vijayawada Airport", "Eluru Road", "Auto Nagar", "Labbipet", "Governorpet",
  "Patamata", "One Town", "Suryaraopet", "Moghalrajpuram", "Krishnalanka",
  "Gunadala", "Kanuru", "Penamaluru", "Ibrahimpatnam", "Nuzvid", "Gudivada",
  "Guntur Bus Stand", "Amaravati Capital", "Kondapalli", "Undavalli Caves",
  "Mangalagiri", "Tenali", "Narasaraopet", "Bapatla", "Chirala", "Ongole",
  "Rajahmundry", "Bhimavaram", "Eluru", "Machilipatnam"
];