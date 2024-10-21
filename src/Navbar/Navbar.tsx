import React, { useEffect, useState,useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoImage from './logolayy.png';
import cartIcon from './CartIcon.png';
import { Dashboard, Favorite, FavoriteBorder, ListAlt, Menu as MenuIcon, Money, Phone, Logout, ExitToApp, Person, Settings, Image, Filter, Filter1, FilterList, Edit, DeliveryDiningSharp, CardTravel, ShoppingCart, ShoppingCartOutlined, Receipt, PasswordOutlined, PrivacyTip, PrivacyTipOutlined, LocalActivityOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { debounce } from 'lodash';
import { Button, Menu, MenuItem, IconButton, Drawer } from '@mui/material';
import { useWebSocket } from '../Components/WebSocketContext';
import notificationSound from '../assets/notification.wav';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { toast } from 'react-toastify';
import AxiosRequest from '../Components/AxiosRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';


const Navbar: React.FC = () => {
  const [scrolling, setScrolling] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [favoriteUpdate, setFavoritesUpdated] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const isClient = localStorage.getItem('isClient') === 'true';
  const ws = useWebSocket() as WebSocket | null;
  const [ownerRestaurantName, setOwnerRestaurantName] = useState('');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [notificationSoundPlaying, setNotificationSoundPlaying] = useState(false);
  const [toastId, setToastId] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());

  const INTERACTION_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds



  useEffect(() => {
      const handleScroll = () => {
          setScrolling(window.scrollY > 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  useEffect(() => {
      const handleUserInteraction = () => {
          setLastInteractionTime(Date.now());
      };

      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);

      return () => {
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
      };
  }, []);

  const customerId = localStorage.getItem('id');
  const loggedIn = localStorage.getItem('token') !== null;
  const restaurantName = localStorage.getItem('resName') ?? '';

useEffect(() => {
    const checkUserLogin = () => {
        if (isAdmin) {
            setIsLoggedIn(true);
            setUserRole('isAdmin');
        } else if (isOwner) {
            setIsLoggedIn(true);
            setUserRole('isOwner');
            setOwnerRestaurantName(restaurantName); // Store the restaurant name
        } else if (isClient) {
            setIsLoggedIn(true);
            setUserRole('isClient');
            if (customerId) fetchCartDebounced(customerId);
        } else {
            setIsLoggedIn(loggedIn);
        }

        if (loggedIn && ws) {
            ws.onopen = () => {
                console.log('WebSocket connection opened');
            };

            ws.onmessage = (event: MessageEvent) => {
                try {
                    let data;

                    // Attempt to parse the data only if it is a valid JSON string
                    try {
                        data = JSON.parse(event.data);
                    } catch (error) {
                        return; // Exit early if parsing fails
                    }
                    console.log('WebSocket message received:', data);

                    if (isClient) {
                        if (data.type === 'cartUpdated') {
                            if (customerId) fetchCartDebounced(customerId);
                        } else if (data.type === 'favoritesUpdated') {
                            setFavoritesUpdated(true);
                        }
                    }

                    if (isOwner && data.type === 'newOrderReceived') {
                        if (data.restaurantName === ownerRestaurantName) {
                            console.log('New order received for your restaurant');
                            const currentTime = Date.now();
                            if (currentTime - lastInteractionTime > INTERACTION_EXPIRY_TIME) {
                                // Show a modal or toast asking the user to interact with the page
                                toast.info('Please click or tap anywhere on the page to enable audio notifications.', {
                                    autoClose: 5000,
                                    onClose: () => {
                                        // Fallback notification without sound
                                        showFallbackNotification();
                                    }
                                });
                                return;
                            }

                            playNotificationSound();
                        }
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onerror = (event) => {
                console.error('WebSocket error:', event);
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event);
            };
        }
    };

    checkUserLogin();
}, [ws, notificationSound, audio, ownerRestaurantName, customerId, loggedIn, restaurantName]);

// Function to play the notification sound
const playNotificationSound = () => {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.loop = false;
        setAudio(null);
    }

    const newAudio = new Audio(notificationSound);
    newAudio.loop = true;

    newAudio.play().catch((error) => {
        console.warn('Audio playback failed:', error);
        toast.info('Please interact with the page to enable audio notifications.', {
            autoClose: 5000
        });
    });

    setAudio(newAudio);

    const id = toast.success(
        <div className="toast-custom">
            <div>{ownerRestaurantName} تم استلام طلب جديد</div>
            <button
                onClick={() => {
                    toast.dismiss(id);
                    if (newAudio) {
                        newAudio.pause();
                        newAudio.currentTime = 0;
                        newAudio.loop = false;
                        setAudio(null);
                    }
                    window.location.reload();
                }}
            >
                موافق
            </button>
        </div>,
        {
            autoClose: false,
            closeButton: false,
            hideProgressBar: true,
            className: 'toast-custom',
            bodyClassName: 'toast-body',
            onClose: () => {
                if (newAudio) {
                    newAudio.pause();
                    newAudio.currentTime = 0;
                    newAudio.loop = false;
                    setAudio(null);
                }
            }
        }
    );

    setToastId(id as string);
};

// Fallback notification when interaction is not detected
const showFallbackNotification = () => {
    toast.warn('New Order Received for your restaurant. Please check your dashboard for details.', {
        autoClose: 5000,
    });
    window.location.reload();
};

    const fetchCart = useCallback(async (customerId: string | null) => {
        try {
            const response = await AxiosRequest.get(`/get-cart/${customerId}`);
            if (response.data?.totalItemsCount !== undefined) {
                setCartCount(response.data.totalItemsCount);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.log('Error fetching cart:', error);
            setCartCount(0);
        }
    }, []);

    // Debounce the fetchCart function
    const fetchCartDebounced = useCallback(debounce(fetchCart, 500), [fetchCart]);
    const handleCartClick = () => {
        navigate('/cart'); // Navigate to /cart
      };
      const handleFavClick = () => {
        navigate('/favorites'); // Navigate to /cart
      };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isOwner');
        localStorage.removeItem('isClient');
        localStorage.removeItem('resName');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        alert('تم تسجيل خروجك بنجاح');
        setIsLoggedIn(false);
        setUserRole('');
        navigate('/');
        window.location.reload();
    };

    const handleLoginRedirect = (path: string, role: string) => {
        if (isLoggedIn && userRole === role) {
            alert('أنت مسجل الدخول بالفعل. يرجى تسجيل الخروج قبل تسجيل الدخول كمستخدم آخر');
        } else {
            navigate(path);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        setAnchorEl(null);
    };

    const handleLogoClick = () => {
        navigate('/'); // Redirect to the home route
      };

    return (
        <>
            {/* Desktop View */}
            <nav className={`navbar desktop-view ${scrolling ? 'scrolling' : ''}`}>
                <div className='navbar-container'>
                        <div onClick={handleLogoClick} className='logo-container hover:cursor-pointer'>
                            <div className='logo'>
                                <img src={logoImage} alt='YourLogo' />
                            </div>
                            <div>
                                <h5 id='Logo2'>Order To Your Location</h5>
                            </div>
                        </div>
                    <div className='user-actions'>
                        {!isLoggedIn && (
                            // <button className="action-btn" onClick={(event) => setAnchorEl(event.currentTarget)}>
                            <button className="action-btn" onClick={() => handleLoginRedirect('/login-client', 'isClient')}>
                                <PersonIcon style={{ marginRight: '1rem' }}/> دخول
                            </button>
                        )}
                        {/* <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {(!isLoggedIn || !isClient) && (
                                <MenuItem onClick={() => handleLoginRedirect('/login-client', 'isClient')}>عميل</MenuItem>
                            )}
                            {(!isLoggedIn || !isOwner) && (
                                <MenuItem onClick={() => handleLoginRedirect('/login-owner', 'isOwner')}>شركاء</MenuItem>
                            )}
                            {!isLoggedIn && (
                                <MenuItem onClick={() => handleLoginRedirect('/admin-login', 'isAdmin')}>ادارة</MenuItem>
                            )}
                        </Menu> */}
                        {!isAdmin &&(
                        <Link to={`/contact-us`} className="action-btn">
                        <Phone style={{ marginRight: '0.5rem' }} /> تواصل معنا
                        </Link>
                          )}
                          {isAdmin &&(
                           <Link to={`/slider-image-list`} className="action-btn">
                            <Image style={{ marginRight: '0.5rem' }} /> اعلانات
                            </Link>
                          )}

                        {/* Conditionally render the button based on the logged-in restaurant name */}
                        {/* {isOwner && (
                            <Link to={`/owner`} className="action-btn">
                                <ListAlt style={{ marginRight: '0.5rem' }}/> الطلبات                            
                                </Link>
                        )} */}
                        {isOwner && (
                            <>
                            <Link to={`/delivery-charges`} className="action-btn">
                                <DeliveryDiningSharp style={{ marginRight: '0.5rem' }}/> رسوم
                            </Link>
                             <Link to={`/coupon-list`} className="action-btn">
                            <LocalActivityOutlined style={{ marginRight: '0.5rem' }}/> قسيمة
                            </Link>
                        </>
                        )}
                                                {isAdmin && (
                                                    <>
                            <Link to={`/delivery-charges`} className="action-btn">
                                <DeliveryDiningSharp style={{ marginRight: '0.5rem' }}/> رسوم
                            </Link>
                                                         <Link to={`/coupon-list`} className="action-btn">
                                                         <LocalActivityOutlined style={{ marginRight: '0.5rem' }}/> قسيمة
                                                         </Link>
                                                         </>
                                                )}
                        {/* {isAdmin && (
                            <Link to={`/all-orders`} className="action-btn">
                                <ListAlt style={{ marginRight: '0.5rem' }}/> الطلبات
                            </Link>
                        )} */}

                        {isOwner && (
                            <Link to={`/`} className="action-btn">
                                <SettingsIcon style={{ marginRight: '0.5rem' }}/> الإعدادات                          
                                </Link>
                        )}
                         {isAdmin && (
                            <Link to={`/filter-list`} className="action-btn">
                                <FilterList style={{ marginRight: '0.5rem' }}/> فلاتر                            
                                </Link>
                        )}
                        {isClient && (
    //   <div onClick={handleCartClick} className='action-btn cursor-pointer'>
    //     <div className="cart-icon-container">
    //         <div className='flex flex-row'>
    //       <img src={cartIcon} width={20} alt="Cart" className="cart-icon mr-[0.5]" /> سلتي
    //      </div>
    //       {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
    //     </div>
    //   </div>
    <>
    <Link to={`/change-password`} className="action-btn">
    <PasswordOutlined style={{ marginRight: '0.5rem' }}/> تغير الرقم السري                           
    </Link>
    <div onClick={handleCartClick} className='action-btn cursor-pointer'>
  <div className="cart-icon-container relative flex items-center">
    <img src={cartIcon} width={20} alt="Cart" className="cart-icon mr-2" />
    <span>سلتي</span>
    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
  </div>
</div>
</>
    )}


{isClient &&(
<div onClick={handleFavClick} className='action-btn cursor-pointer'>
<div className={`cart-icon-container ${favoriteUpdate ? 'text-red-600' : ''}`}>
                                        {favoriteUpdate ? <Favorite  style={{ color: 'red',marginRight: '0.5rem' }} /> : <FavoriteBorder style={{ color: 'black',marginRight: '0.5rem' }} />}
                                        المفضل
                                    </div>
                                </div>
)}
                                {isLoggedIn && (isAdmin || isOwner) && (
                                    <Link to="/finance" className='action-btn'>
                                        <div className='cart-icon-container'>
                                            <Money style={{ marginRight: '0.5rem' }}/> إدارة المال
                                        </div>
                                    </Link>
                                )}
                                {isLoggedIn && isAdmin && (
                                    <Link to="/admin-dashboard" className='action-btn'>
                                        <div className='cart-icon-container'>
                                            <Dashboard style={{ marginRight: '0.5rem' }} />
                                            لوحة التحكم
                                        </div>
                                    </Link>
                                )}
                            <Link to={`/privacy-policy`} className="action-btn">
                                <PrivacyTipOutlined style={{ marginRight: '0.5rem' }}/> سياسة الخصوصية                           
                                </Link>
                                {isLoggedIn && (
                            <>
                                <button className='action-btn' onClick={handleLogout}>
                                    <ExitToApp style={{ marginRight: '0.5rem' }} /> تسجيل خروج
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile View */}
            <nav className={`navbar mobile-view ${scrolling ? 'scrolling' : ''}`}>
                {/* Mobile content */}
                <div className='navbar-container'>
                    <Link to="/">
                        <div className='logo-container'>
                            <div className='logo'>
                                <img src={logoImage} alt='YourLogo' />
                            </div>
                            <div>
                                <h5 id='Logo2'>Order To Your Location</h5>
                            </div>
                        </div>
                    </Link>

                    <div className='user-actions gap-2'>
                        {isClient && (
                            <div className='flex space-x-4'>
                            <div onClick={handleFavClick} className='action-btn flex items-center justify-center cursor-pointer'>
                                        {favoriteUpdate ? <Favorite sx={{color:'red'}} fontSize='medium'  /> : <FavoriteBorder fontSize='medium' sx={{ color: 'black'}} />}
                                </div>
                                <div onClick={handleCartClick} className='action-btn flex items-center justify-center cursor-pointer'>
                                        {/* <img src={cartIcon} alt="Cart" className='w-full object-cover'/> */}
                                        <ShoppingCartOutlined fontSize='medium'/>
                                        {cartCount > 0 && <span className="cart-count-mobile">{cartCount}</span>}
                                </div>
                            </div>
                        )}
                        <IconButton className="menu-icon" onClick={toggleMenu}>
                            <MenuIcon />
                        </IconButton>
 <Drawer
      anchor="right"
      open={isMenuOpen}
      onClose={toggleMenu}
      classes={{ paper: '!bg-gradient-to-r from-blue-500 to-blue-200' }} // Adds background color to the drawer
    >
      <div className="p-6 ">
        <h3 id='SideTextNav' className="text-2xl font-bold mb-4 text-gray-800">Layla</h3>
        <div className="space-y-2">
          {/* Conditional rendering based on auth state */}
          {/* {!isLoggedIn && !isAdmin && (
            <MenuItem
              className="hover:bg-gray-200 text-white rounded-md p-2 transition-colors duration-200"
              onClick={() => handleLoginRedirect('/admin-login', 'isAdmin')}
            >
              <Person style={{ marginRight: '0.2rem' }}/> ادارة
            </MenuItem>
          )} */}
          {!isLoggedIn && !isClient && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => handleLoginRedirect('/login-client', 'isClient')}
            >
              <Person style={{ marginRight: '0.2rem' }}/> تسجيل الدخول
            </MenuItem>
          )}
          {/* {!isLoggedIn && !isOwner && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => handleLoginRedirect('/login-owner', 'isOwner')}
            >
              <Person style={{ marginRight: '0.2rem' }}/> شركاء
            </MenuItem>
          )} */}
          {isLoggedIn && (isAdmin || isOwner) && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => navigate('/finance')}
            >
              <Money style={{ marginRight: '0.2rem' }} /> إدارة المال
            </MenuItem>
          )}
          {isOwner && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => navigate(`/owner`)}
            >
              <ListAlt style={{ marginRight: '0.2rem' }}/> طلبات
            </MenuItem>
          )}
                                  {isAdmin && (
                                    <>
                                    {/* <MenuItem
                                    className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
                                    onClick={() => navigate(`/all-orders`)}
                                  >
                                <ListAlt style={{ marginRight: '0.2rem' }}/> طلبات
                            </MenuItem> */}
                             <MenuItem
                            className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
                            onClick={() => navigate(`/admin-dashboard`)}
                             >
                            <Dashboard style={{ marginRight: '0.2rem' }}/> لوحة الإعدادات
                            </MenuItem>
                            </>
                        )}
          {isOwner  && (
            <>
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => navigate(`/`)}
            >
             <SettingsIcon style={{ marginRight: '0.2rem' }}/> الإعدادات
            </MenuItem>
            <MenuItem
             className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
             onClick={() => navigate(`/delivery-charges`)}
                >
            <DeliveryDiningSharp style={{ marginRight: '0.2rem' }}/> رسوم
            </MenuItem>
            <MenuItem
             className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
             onClick={() => navigate(`/coupon-list`)}
                >
            <LocalActivityOutlined style={{ marginRight: '0.2rem' }}/> قسيمة
            </MenuItem>
            <MenuItem
             className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
             onClick={() => navigate(`/update-opening-hours/${restaurantName}`, { state: { resName: restaurantName } })}
                >
            <AccessTimeOutlined style={{ marginRight: '0.2rem' }}/> ساعات العمل
            </MenuItem>
            </>
          )}


                          {isAdmin &&(
                            <>
                           <MenuItem onClick={() => navigate('/slider-image-list')} className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200">
                            <Image style={{ marginRight: '0.2rem' }} /> اعلانات
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/filter-list')} className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200">
                            <FilterList style={{ marginRight: '0.2rem' }}/> فلاتر                            
                            </MenuItem>
                            <MenuItem
             className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
             onClick={() => navigate(`/delivery-charges`)}
                >
            <DeliveryDiningSharp style={{ marginRight: '0.2rem' }}/> رسوم
            </MenuItem>
            <MenuItem
             className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
             onClick={() => navigate(`/coupon-list`)}
                >
            <LocalActivityOutlined style={{ marginRight: '0.2rem' }}/> قسيمة
            </MenuItem>
            {/* <MenuItem
             className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
             onClick={() => navigate(`/coupon-list`)}
                >
            <AccessTimeOutlined style={{ marginRight: '0.2rem' }}/> Change
            </MenuItem> */}
                            </>
                          )}
                {isClient &&(    
                    <>              
          <MenuItem
            className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
            onClick={() => navigate('/orders')}
          >
           <Receipt style={{ marginRight: '0.2rem' }}/> طلباتي
          </MenuItem>
                    <MenuItem
                    className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
                    onClick={() => navigate('/cart')}
                  >
                   <ShoppingCartOutlined style={{ marginRight: '0.2rem' }}/> سلتي
                  </MenuItem>
                  <MenuItem
                    className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
                    onClick={() => navigate('/change-password')}
                  >
                   <PasswordOutlined style={{ marginRight: '0.2rem' }}/> تغير الرقم السري
                  </MenuItem>
                  <MenuItem
                    className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
                    onClick={() => navigate('/favorites')}
                  >
                   <Favorite style={{ marginRight: '0.2rem',color:'red' }}/> المفضلة
                  </MenuItem>
                  </>
        )}                  
        {!isAdmin &&(                  
          <MenuItem
            className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
            onClick={() => navigate('/contact-us')}
          >
           <Phone style={{ marginRight: '0.2rem' }}/> تواصل معنا
          </MenuItem>
        )}
                  <MenuItem
            className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
            onClick={() => navigate('/privacy-policy')}
          >
           <PrivacyTipOutlined style={{ marginRight: '0.2rem' }}/> سياسة الخصوصية
          </MenuItem>
          {isLoggedIn && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={handleLogout}
            >
              <ExitToApp style={{ marginRight: '0.2rem' }}/> تسجيل خروج
            </MenuItem>
          )}
        </div>
      </div>
    </Drawer>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;