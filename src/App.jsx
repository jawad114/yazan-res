import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Navbar from './Navbar/Navbar';
import MapComponent from './Components/MapComponent';
import { FavoriteProvider } from './Favorite/FavoriteContext';
import LoginClient from './views/auth/LoginClient/Login';
import LoginOwner from './views/auth/LoginOwner/Login';
import RegistrationOwner from './views/auth/RegistrationOwner/Registration';
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
import FavoritePage from './Favorite/FavoritePage';
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


const theme = createTheme();

const toastStyle = {
  container: "max-w-sm mx-auto",
  toast: "bg-red-500 text-white font-bold",
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <FavoriteProvider>
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
          <div className='main-container'>
            <Routes>
              <Route path='/' element={<HomeComponent />} />
              <Route path='/:resName' element={<HomeComponent />} />
              <Route path='/login-owner' element={<LoginOwner />} />
              <Route path='/login-client' element={<LoginClient />} />
              <Route path='/register-client' element={<Registration />} />
              <Route path='/admin-login' element={<AdminLogin />} />
              <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/contact-us' element={<ContactUs />} />
              <Route path='/privacy-policy' element={<PrivacyPolicy />} />
              <Route path='/client-dashboard' element={<ClientDashboard />} />
              <Route path='/categories/:resName' element={<Categories />} />
              <Route path='/categories/:resName/:categoryName' element={<CategoryDetails />} />
              <Route path='/edit/:resName/:categoryName/:dishId' element={<EditDish />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/favorites' element={<Favorites />} />
              <Route path='/request-credentials' element={<Ownerform />} />
              <Route path='/edit/:resName' element={<EditRestaurant />} />
              <Route path='/owner/:resName' element={<Ownerdashboard />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/favorite' element={<FavoritePage />} />
              <Route path='/finance' element={<Finance />} />
              <Route path='/forgot-password' element={<Forgot />} />
              <Route path='/reset-password' element={<Reset />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/update-opening-hours/:restaurantName' element={<UpdateHours />} />
              <Route path='/add-category/:resName' element={<AddCategory />} />
              <Route path='/add-dish/:resName/:categoryName' element={<AddDish />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </FavoriteProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
