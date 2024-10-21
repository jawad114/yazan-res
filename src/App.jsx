import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import LoginClient from './views/auth/LoginClient/Login';
import LoginOwner from './views/auth/LoginOwner/Login';
import Registration from './views/auth/RegistrationClient/Registration';
import AdminLogin from './views/auth/adminLogin';
import NotFound from './views/404';
import AdminDashboard from './views/Admin Dashboard/adminDashboard';
import ContactUs from './views/Contact/ContactUs';
import PrivacyPolicy from './views/privacyPolicy/pricavy';
import ClientDashboard from './views/clientDashboard/clientDashboard';
import HomeComponent from './Home/Home';
import CategoryDetails from './views/categoryDetails/categoryDetails';
import Cart from './views/cart/cart';
import './global.css';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Ownerform from './views/requestForm';
import Ownerdashboard from './views/ownerdash/ownerdashboard';
import Categories from './views/categories/categories';
import Checkout from './views/checkout/checkout';
import EditRestaurant from './EditRestaurant/EditRestaurant';
import EditDish from './EditDish/EditDish';
import Orders from './Orders/Orders';
import Favorites from './views/Favorites/Favorites';
import Finance from './views/Finance/Finance';
import Forgot from './views/auth/ForgotPassword/Forgot';
import Reset from './views/auth/ResetPassword/Reset';
import Verify from './views/auth/RegistrationClient/Verify/Verify';
import UpdateHours from './views/UpdateHours/UpdateHours';
import AddCategory from './views/categories/AddCategory/AddCategory';
import AddDish from './views/AddDish/AddDish';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import InvalidAccessPage from './views/InvalidAccessPage/InvalidAccessPage';
import AdminOrder from './views/AdminOrder/AdminOrder';
import UpdateEmail from './views/auth/LoginOwner/UpdateEmail/UpdateEmail';
import ForgotOwner from './views/auth/LoginOwner/ForgotOwner/ForgotOwner';
import ResetOwner from './views/auth/LoginOwner/ResetOwner/ResetOwner';
import SliderImageList from './views/SliderImageList/SliderImageList';
import AddImagePage from './views/AddImagePage/AddImagePage';
import AddFilterPage from './views/AddFilterPage/AddFilterPage';
import FilterList from './views/FilterList/FilterList';
import BackToTopButton from './Components/BackToTopButton';
import DeliveryCharges from './views/DeliveryCharges/DeliveryCharges';
import ChangePassword from './views/ChangePassword/ChangePassword';
import CouponForm from './views/CouponManagement/CouponForm';
import CouponList from './views/CouponManagement/CouponList';

const theme = createTheme();

const toastStyle = {
  container: "max-w-sm mx-auto",
  toast: "bg-red-500 text-white font-bold",
};



const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <Router>
          <Navbar />
          <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        limit={1}
        draggable
        pauseOnHover
        style={toastStyle}
      />
      {/* <AccessibilityButton sitekey={sitekey}/> */}
          <div className='main-container'>
            <Routes>
              <Route path='/' element={<HomeComponent />} />
              <Route path='/:resName' element={<HomeComponent />} />
              <Route path='/login-owner' element={<LoginOwner />} />
              <Route path='/login-client' element={<LoginClient />} />
              <Route path='/register-client' element={<Registration />} />
              <Route path='/admin-login' element={<AdminLogin />} />
              <Route path='/create-coupon' element={<CouponForm />} />
              <Route path='/coupon-list' element={<CouponList />} />
              <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/contact-us' element={<ContactUs />} />
              <Route path='/privacy-policy' element={<PrivacyPolicy />} />
              <Route path='/client-dashboard' element={<ClientDashboard />} />
              <Route path='/categories/:resName' element={<Categories />} />
              <Route path='/categories/:resName/:categoryName' element={<CategoryDetails />} />
              <Route path='/edit/:resName/:categoryName/:dishId' element={<EditDish />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/owner-email-update' element={<UpdateEmail />} />
              <Route path='/favorites' element={<Favorites />} />
              <Route path='/request-credentials' element={<Ownerform />} />
              <Route path='/change-password' element={<ChangePassword />} />
              <Route path='/edit/:resName' element={<EditRestaurant />} />
              <Route path='/delivery-charges' element={<DeliveryCharges />} />
              <Route path='/owner' element={<Ownerdashboard />} />
              <Route path='/forbidden' element={<InvalidAccessPage />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/all-orders' element={<AdminOrder />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/finance' element={<Finance />} />
              <Route path='/forgot-password' element={<Forgot />} />
              <Route path='/reset-password' element={<Reset />} />
              <Route path='/slider-image-list' element={<SliderImageList />} />
              <Route path='/add-slider-image' element={<AddImagePage />} />
              <Route path='/filter-list' element={<FilterList />} />
              <Route path='/add-filter' element={<AddFilterPage />} />
              <Route path='/forgot-password-owner' element={<ForgotOwner />} />
              <Route path='/reset-password-owner' element={<ResetOwner />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/update-opening-hours/:restaurantName' element={<UpdateHours />} />
              <Route path='/add-category/:resName' element={<AddCategory />} />
              <Route path='/add-dish/:resName/:categoryName' element={<AddDish />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
          <BackToTopButton />
      </Router>
    </ThemeProvider>
  );
};

export default App;
