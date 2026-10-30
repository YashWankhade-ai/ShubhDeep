import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { CartProvider } from "./context/CartContext";

// Customer components & pages
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import TrackOrder from "./pages/TrackOrder";
import UserLogin from "./pages/UserLogin";
import CustomerAccount from "./pages/CustomerAccount";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

// Scroll to top on every navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Guard for Admin
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8EC]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#8A5A44] font-semibold">
            Authenticating ShubhDeep Admin...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Customer Layout Wrapper
const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EC] text-[#42121B] selection:bg-[#C5A15B]/30 selection:text-[#42121B]">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Toaster 
              position="bottom-right" 
              richColors 
              toastOptions={{
                style: {
                  background: '#42121B',
                  color: '#FFF8EC',
                  border: '1px solid #C5A15B',
                }
              }}
            />
            <Routes>
              {/* Customer-facing store routes */}
              <Route
                path="/"
                element={
                  <CustomerLayout>
                    <Home />
                  </CustomerLayout>
                }
              />
              <Route
                path="/shop"
                element={
                  <CustomerLayout>
                    <Shop />
                  </CustomerLayout>
                }
              />
              <Route
                path="/shop/:collectionId"
                element={
                  <CustomerLayout>
                    <Shop />
                  </CustomerLayout>
                }
              />
              <Route
                path="/product/:productId"
                element={
                  <CustomerLayout>
                    <ProductDetails />
                  </CustomerLayout>
                }
              />
              <Route
                path="/our-story"
                element={
                  <CustomerLayout>
                    <OurStory />
                  </CustomerLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <CustomerLayout>
                    <Contact />
                  </CustomerLayout>
                }
              />
              <Route
                path="/policies/:policyId"
                element={
                  <CustomerLayout>
                    <Policies />
                  </CustomerLayout>
                }
              />
              <Route
                path="/track-order"
                element={
                  <CustomerLayout>
                    <TrackOrder />
                  </CustomerLayout>
                }
              />

              {/* Customer / Patron Authentication & Account */}
              <Route
                path="/login"
                element={
                  <CustomerLayout>
                    <UserLogin />
                  </CustomerLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <CustomerLayout>
                    <UserLogin />
                  </CustomerLayout>
                }
              />
              <Route
                path="/account"
                element={
                  <CustomerLayout>
                    <CustomerAccount />
                  </CustomerLayout>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <CustomerLayout>
                    <CustomerAccount />
                  </CustomerLayout>
                }
              />

              {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Management Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedAdminRoute>
                  <AdminProducts />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <ProtectedAdminRoute>
                  <AdminProductForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/products/edit/:productId"
              element={
                <ProtectedAdminRoute>
                  <AdminProductForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedAdminRoute>
                  <AdminOrders />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/orders/:orderId"
              element={
                <ProtectedAdminRoute>
                  <AdminOrderDetails />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedAdminRoute>
                  <AdminCustomers />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <ProtectedAdminRoute>
                  <AdminInventory />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedAdminRoute>
                  <AdminCategories />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedAdminRoute>
                  <AdminAnalytics />
                </ProtectedAdminRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </CartProvider>
        </CustomerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
