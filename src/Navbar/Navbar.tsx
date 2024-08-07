import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoImage from './logolayy.png';
import cartIcon from './CartIcon.png';
import { Dashboard, Favorite, FavoriteBorder, ListAlt, Menu as MenuIcon, Money, Phone, Logout, ExitToApp, Person, Settings } from '@mui/icons-material';
import { debounce } from 'lodash';
import { Button, Menu, MenuItem, IconButton, Drawer } from '@mui/material';
import { useWebSocket } from '../Components/WebSocketContext';
import notificationSound from '../assets/notification.wav';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { toast } from 'react-toastify';
import AxiosRequest from '../Components/AxiosRequest';


const Navbar: React.FC = () => {
    const [scrolling, setScrolling] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [favoriteUpdate, setFavoritesUpdated] = useState(false);
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
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
              console.log('WebSocket message received:', event.data);
              try {
                const data = JSON.parse(event.data);
    
                if (isClient && data.type === 'cartUpdated') {
                  if (customerId) fetchCartDebounced(customerId);
                } else if (isClient && data.type === 'favoritesUpdated') {
                  setFavoritesUpdated(true);
                }
    
                // if (isOwner && data.type === 'newOrderReceived') {
                //   if (data.restaurantName === ownerRestaurantName) {
                //     console.log('New order received for your restaurant');
    
                //     if (audio) {
                //         audio.pause();
                //         audio.currentTime = 0;
                //         audio.loop = false; // Ensure the loop is stopped
                //         setAudio(null); // Clear the audio object
                //       }
      
                //       // Create a new audio instance and set it to loop
                //       const newAudio = new Audio(notificationSound);
                //       newAudio.loop = true; // Set loop to true initially
                //       newAudio.play();
                //       setAudio(newAudio); // Store the new audio instance
      
                //       // Show toast with 'Got it' button
                //       const id = toast.success(
                //         <div className="toast-custom">
                //           <div>New Order Received for {ownerRestaurantName}</div>
                //           <button
                //             onClick={() => {
                //               toast.dismiss(id); // Dismiss the toast
                //               if (newAudio) {
                //                 newAudio.pause();
                //                 newAudio.currentTime = 0;
                //                 newAudio.loop = false; // Stop the loop
                //                 setAudio(null); // Clear the audio object
                //               }
                //               window.location.reload();
                //             }}
                //           >
                //             Got it
                //           </button>
                //         </div>,
                //         {
                //           autoClose: false, // Prevent auto-close
                //           closeButton: false,
                //           hideProgressBar: true,
                //           className: 'toast-custom',
                //           bodyClassName: 'toast-body',
                //           onClose: () => {
                //             if (newAudio) {
                //               newAudio.pause();
                //               newAudio.currentTime = 0;
                //               newAudio.loop = false; // Ensure loop is stopped
                //               setAudio(null); // Clear the audio object
                //             }
                //           }
                //         }
                //       );
      
                //       setToastId(id as string); // Explicitly cast id to string
                //     }
                //   }

                if (isOwner && data.type === 'newOrderReceived' && data.restaurantName === ownerRestaurantName) {
                  console.log('New order received for your restaurant');
            
                  // Show initial toast
                  const id = toast.info(
                    <div className="toast-custom">
                      <div>New Order Received for {ownerRestaurantName}</div>
                      <button
                        onClick={async () => {
                          toast.dismiss(id); // Dismiss the initial toast
            
                          // Create and play the audio
                          if (audio) {
                            audio.pause();
                            audio.currentTime = 0;
                            audio.loop = false;
                            setAudio(null);
                          }
            
                          const newAudio = new Audio(notificationSound);
                          newAudio.loop = true;
            
                          try {
                            await newAudio.play();
                            setAudio(newAudio);
                            setNotificationSoundPlaying(true);
            
                            // Show the "Got It" toast after the audio starts playing
                            const gotItToastId = toast.success(
                              <div className="toast-custom">
                                <div>Notification sound is playing</div>
                                <button
                                  onClick={() => {
                                    toast.dismiss(gotItToastId); // Dismiss the "Got It" toast
                                    if (newAudio) {
                                      newAudio.pause();
                                      newAudio.currentTime = 0;
                                      newAudio.loop = false;
                                      setAudio(null);
                                    }
                                    window.location.reload(); // Reload the page
                                  }}
                                >
                                  Got it
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
                          } catch (error) {
                            console.error('Failed to play audio:', error);
                          }
                        }}
                      >
                        Play Notification Sound
                      </button>
                    </div>,
                    {
                      autoClose: false,
                      closeButton: false,
                      hideProgressBar: true,
                      className: 'toast-custom',
                      bodyClassName: 'toast-body',
                    }
                  );
            
                  setToastId(id as string);
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
        }, [ws, notificationSound, audio, ownerRestaurantName,customerId,loggedIn,restaurantName]);

    const fetchCart = async (customerId: string | null) => {
        try {
            const response = await AxiosRequest.get(`/get-cart/${customerId}`);
            if (response.data && response.data.totalItemsCount !== undefined) {
                setCartCount(response.data.totalItemsCount);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.log('Error fetching cart:', error);
            setCartCount(0);
        }
    };

    const fetchCartDebounced = debounce(fetchCart, 500);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isOwner');
        localStorage.removeItem('isClient');
        localStorage.removeItem('resName');
        localStorage.removeItem('name');
        alert('You have been successfully logged out.');
        setIsLoggedIn(false);
        setUserRole('');
        navigate('/');
        window.location.reload();
    };

    const handleLoginRedirect = (path: string, role: string) => {
        if (isLoggedIn && userRole === role) {
            alert('You are already signed in. Please log out before signing in as a different user.');
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

    return (
        <>
            {/* Desktop View */}
            <nav className={`navbar desktop-view ${scrolling ? 'scrolling' : ''}`}>
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

                    <div className='user-actions'>
                        {!isLoggedIn && (
                            <button className="action-btn" onClick={(event) => setAnchorEl(event.currentTarget)}>
                                <PersonIcon /> Login As
                            </button>)}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {(!isLoggedIn || !isClient) && (
                                <MenuItem onClick={() => handleLoginRedirect('/login-client', 'isClient')}>Client</MenuItem>
                            )}
                            {(!isLoggedIn || !isOwner) && (
                                <MenuItem onClick={() => handleLoginRedirect('/login-owner', 'isOwner')}>Res-Owner</MenuItem>
                            )}
                            {!isLoggedIn && (
                                <MenuItem onClick={() => handleLoginRedirect('/admin-login', 'isAdmin')}>Admin</MenuItem>
                            )}
                        </Menu>
                        <button className='action-btn' onClick={() => navigate('/contact-us')}>
                            <Phone style={{ marginRight: '0.5rem' }} /> Contact Us
                        </button>

                        {/* Conditionally render the button based on the logged-in restaurant name */}
                        {isOwner && (
                            <Link to={`/owner`} className="action-btn">
                                <ListAlt />Orders                            
                                </Link>
                        )}
                        {isAdmin && (
                            <Link to={`/all-orders`} className="action-btn">
                                <ListAlt />Orders
                            </Link>
                        )}

                        {isOwner && (
                            <Link to={`/`} className="action-btn">
                                <SettingsIcon />Settings                            </Link>
                        )}
                        {isAdmin && (
                            <Link to={`/`} className="action-btn">
                                <SettingsIcon />Settings
                            </Link>
                        )}
                        {isClient && (
                            <Link to="/cart" className='action-btn'>
                                <div className="cart-icon-container">
                                    <img src={cartIcon} width={20} alt="Cart" className="cart-icon" />
                                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                                </div>
                            </Link>
                        )}

                        {isLoggedIn && (
                            <>

                                <Link to="/favorites" className='action-btn'>
                                    <div className={`cart-icon-container ${favoriteUpdate ? 'text-red-600' : ''}`}>
                                        {favoriteUpdate ? <Favorite  style={{ color: 'red' }} /> : <FavoriteBorder style={{ color: 'black' }} />}
                                        Favorite
                                    </div>
                                </Link>

                                {isLoggedIn && (isAdmin || isOwner) && (
                                    <Link to="/finance" className='action-btn'>
                                        <div className={`cart-icon-container}`}>
                                            <Money />Finance
                                        </div>
                                    </Link>
                                )}
                                {isLoggedIn && isAdmin && (
                                    <Link to="/admin-dashboard" className='action-btn'>
                                        <div className={`cart-icon-container}`}>
                                            <Dashboard className="w-6 h-6" />
                                            Dashboard
                                        </div>
                                    </Link>
                                )}

                                <button className='action-btn' onClick={handleLogout}>
                                    <ExitToApp style={{ marginRight: '0.5rem' }} /> Logout
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
                        {isLoggedIn && (
                            <div className='flex space-x-4'>

                                <Link to="/favorites" className='action-btn'>
                                    <div className={`cart-icon-container ${favoriteUpdate ? 'text-red-600' : ''}`}>
                                        {favoriteUpdate ? <Favorite style={{ color: 'red' , fontSize: 18 }} /> : <FavoriteBorder style={{ color: 'black' , fontSize: 18 }} />}
                                    </div>
                                </Link>


                                <Link to="/cart" className='action-btn'>
                                    <div className="cart-icon-container">
                                        <img src={cartIcon} alt="Cart" className="cart-icon" />
                                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                                    </div>
                                </Link>
                            </div>
                        )}
                        <IconButton className="menu-icon" onClick={toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                        {/* <Drawer anchor="right" open={isMenuOpen} onClose={toggleMenu}>
                            <h3 id='SideTextNav'>Layla</h3>


                            <div className="mobile-menu mt-4 bg-white p-4">
                                {!isLoggedIn && !isAdmin && (
                                    <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => handleLoginRedirect('/admin-login', 'isAdmin')}>
                                        Admin
                                    </MenuItem>
                                )}
                                {!isLoggedIn && !isClient && (
                                    <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => handleLoginRedirect('/login-client', 'isClient')}>
                                        Client
                                    </MenuItem>
                                )}
                                {!isLoggedIn && !isOwner && (
                                    <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => handleLoginRedirect('/login-owner', 'isOwner')}>
                                        Res-Owner
                                    </MenuItem>
                                )}
                                {isLoggedIn && (isAdmin || isOwner) && (
                                    <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => navigate('/finance')}>
                                        Finance
                                    </MenuItem>
                                )}
                                {isOwner && (
                                    <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => navigate(`/owner/${'resName'}`)}>
                                        Orders
                                    </MenuItem>
                                )}
                                {isOwner && (
                                    <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => navigate(`/`)}>
                                        Settings
                                    </MenuItem>
                                )}
                                {isAdmin && (
                                    <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => navigate(`/`)}>
                                        Settings
                                    </MenuItem>
                                )}
                                <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={() => navigate('/contact-us')}>
                                    Contact Us
                                </MenuItem>
                                {isLoggedIn && (
                                    <>
                                        <MenuItem className="py-2 px-4 hover:bg-gray-200" onClick={handleLogout}>
                                            Logout
                                        </MenuItem>
                                    </>
                                )}
                            </div>
                        </Drawer> */}
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
          {!isLoggedIn && !isAdmin && (
            <MenuItem
              className="hover:bg-gray-200 text-white rounded-md p-2 transition-colors duration-200"
              onClick={() => handleLoginRedirect('/admin-login', 'isAdmin')}
            >
              Admin
            </MenuItem>
          )}
          {!isLoggedIn && !isClient && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => handleLoginRedirect('/login-client', 'isClient')}
            >
              Client
            </MenuItem>
          )}
          {!isLoggedIn && !isOwner && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => handleLoginRedirect('/login-owner', 'isOwner')}
            >
              Res-Owner
            </MenuItem>
          )}
          {isLoggedIn && (isAdmin || isOwner) && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => navigate('/finance')}
            >
              Finance
            </MenuItem>
          )}
          {isOwner && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => navigate(`/owner`)}
            >
              Orders
            </MenuItem>
          )}
          {isOwner && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => navigate(`/`)}
            >
              Settings
            </MenuItem>
          )}
          {isAdmin && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={() => navigate(`/`)}
            >
              Settings
            </MenuItem>
          )}
          <MenuItem
            className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
            onClick={() => navigate('/contact-us')}
          >
            Contact Us
          </MenuItem>
          {isLoggedIn && (
            <MenuItem
              className="hover:bg-gray-200 rounded-md p-2 text-white transition-colors duration-200"
              onClick={handleLogout}
            >
              Logout
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