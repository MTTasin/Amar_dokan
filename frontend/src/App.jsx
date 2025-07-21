import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Thunks
import { fetchProducts } from './store/productsSlice';
import { fetchSiteConfig } from './store/siteSlice';
import { fetchColors, fetchSizes } from './store/filtersSlice';
import { fetchCategories } from './store/categoriesSlice';
import { fetchWishlist } from './store/authSlice';
import { fetchOrders } from './store/ordersSlice';
import { fetchAllUsers, fetchRoles } from './store/usersSlice';
import { fetchHeroSlides } from './store/heroSlice';
import { fetchFeaturedProducts } from './store/productsSlice';

// Pages and Components
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import OrderHistory from './pages/dashboard/OrderHistory.jsx';
// Import Admin Components
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'; // FIXED: Added missing import
import AdminProductList from './pages/admin/AdminProductList.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';
import AdminCategoryList from './pages/admin/AdminCategoryList.jsx';
import AdminOrderList from './pages/admin/AdminOrderList.jsx';
import AdminAttributesPage from './pages/admin/AdminAttributesPage.jsx';
import AdminSiteConfigPage from './pages/admin/AdminSiteConfigPage.jsx';
import AdminUserList from './pages/admin/AdminUserList.jsx';
import AdminHeroSlides from './pages/admin/AdminHeroSlides.jsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AuthLayout = ({children}) => <div className="bg-gray-100">{children}</div>;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user?.is_staff) return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSiteConfig());
    dispatch(fetchProducts());
    dispatch(fetchColors());
    dispatch(fetchSizes());
    dispatch(fetchCategories());
    dispatch(fetchHeroSlides());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
      dispatch(fetchOrders());
      if (user?.is_staff) {
        dispatch(fetchAllUsers());
        dispatch(fetchRoles());
      }
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/products/:productId" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

        {/* Protected User Routes */}
        <Route path="/wishlist" element={<ProtectedRoute><Layout><WishlistPage /></Layout></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>}>
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Layout><AdminDashboardPage /></Layout></AdminRoute>}>
            <Route path="products" element={<AdminProductList />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:productId" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategoryList />} />
            <Route path="orders" element={<AdminOrderList />} />
            <Route path="attributes" element={<AdminAttributesPage />} />
            <Route path="settings" element={<AdminSiteConfigPage />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="hero" element={<AdminHeroSlides />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
