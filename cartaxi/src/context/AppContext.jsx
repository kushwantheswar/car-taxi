import React, { createContext, useContext, useState, useCallback } from "react";
import { CARS, BOOKINGS, DRIVERS } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  // ─── REVERTED TO CAR TAXI LOGIC ───
  const [screen, setScreen] = useState("admin-app"); // Start at admin dashboard to avoid login errors
  const [role, setRole] = useState("admin");
  
  const [page, setPage] = useState("dashboard");
  const [bill, setBill] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Reverted Data State
  const [cars, setCars] = useState(CARS);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [drivers, setDrivers] = useState(DRIVERS);

  const login = useCallback((r) => {
    setRole(r);
    setPage("dashboard");
    setScreen(r + "-app");
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setPage("dashboard");
    setScreen("admin-login");
    setBill(null);
  }, []);

  const showNotification = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // Car Functions
  const addCar = useCallback((car) => {
    setCars(prev => [...prev, { ...car, id: Date.now(), status: "available", driverRating: 5.0, driverTrips: 0 }]);
  }, []);

  const removeCar = useCallback((id) => {
    setCars(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateCarStatus = useCallback((id, status) => {
    setCars(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }, []);

  // Booking Functions
  const addBooking = useCallback((booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  const updateBookingStatus = useCallback((id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, []);

  // Driver Functions
  const addDriver = useCallback((driver) => {
    setDrivers(prev => [...prev, { ...driver, id: Date.now(), rating: 5.0, trips: 0, earnings: 0 }]);
  }, []);

  const removeDriver = useCallback((id) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      screen, setScreen, role, login, logout,
      page, setPage,
      bill, setBill,
      sidebarOpen, setSidebarOpen,
      notification, showNotification,
      // Original Exports
      cars, addCar, removeCar, updateCarStatus,
      bookings, addBooking, updateBookingStatus,
      drivers, addDriver, removeDriver,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);