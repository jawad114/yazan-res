// // RestaurantMenu.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import OrderOptionsPopup from './OrderOptionsPopup';
// import './Restaurantone.css';

// interface MenuItem {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//     image: string;
//     options: string[];
//     category: string;
// }

// interface CartItem {
//     id: number;
//     name: string;
//     price: number;
//     quantity: number;
//     image: string;
// }

// const menuItems: MenuItem[] = [
//     {
//         id: 1,
//         name: 'Chicken Burger',
//         description: '',
//         price: 7.99,
//         image: 'https://www.solopress.com/blog/wp-content/uploads/2014/09/shutterstock_334960748.jpg',
//         options: ['Option 1', 'Option 2'],
//         category: 'burger',
//     },
//     {
//         id: 2,
//         name: 'Cheese Pizza',
//         description: '',
//         price: 12.99,
//         image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg',
//         options: ['Option A', 'Option B'],
//         category: 'pizza',
//     },
//     {
//         id: 3,
//         name: 'Vegetarian Salad',
//         description: '',
//         price: 9.99,
//         image: 'https://www.foodandwine.com/thmb/q9tccMZgV9aifYtmlvh9qcPmb_8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Greek-Salad-Romaine-FT-RECIPE1222-8a49c63ede714dfb8fdc0c35088fcd18.jpg',
//         options: ['Option X', 'Option Y'],
//         category: 'salad',
//     },
//     {
//         id: 4,
//         name: 'Chicken Burger',
//         description: '',
//         price: 7.99,
//         image: 'https://www.solopress.com/blog/wp-content/uploads/2014/09/shutterstock_334960748.jpg',
//         options: ['Option 1', 'Option 2'],
//         category: 'burger',
//     },
//     {
//         id: 5,
//         name: 'Chicken Burger',
//         description: '',
//         price: 7.99,
//         image: 'https://www.solopress.com/blog/wp-content/uploads/2014/09/shutterstock_334960748.jpg',
//         options: ['Option 1', 'Option 2'],
//         category: 'burger',
//     },
//     {
//         id: 6,
//         name: 'Chicken Burger',
//         description: '',
//         price: 7.99,
//         image: 'https://www.solopress.com/blog/wp-content/uploads/2014/09/shutterstock_334960748.jpg',
//         options: ['Option 1', 'Option 2'],
//         category: 'burger',
//     },
// ];

// const RestaurantMenu: React.FC = () => {
//     const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
//     const [showPopup, setShowPopup] = useState<boolean>(false);
//     const [cart, setCart] = useState<CartItem[]>([]);
//     const navigate = useNavigate();
//     const [activeFilter, setActiveFilter] = useState<string>('');

//     const handleOrderNow = (item: MenuItem) => {
//         setSelectedItem(item);
//         setShowPopup(true);
//     };

//     const handleConfirmOrder = (cartItem: CartItem) => {
//         setCart((prevCart) => [...prevCart, cartItem]);
//     };

//     const handleCancelOrder = () => {
//         setShowPopup(false);
//         setSelectedItem(null);
//     };

//     const toggleFilter = (searchTerm: string) => {
//         setActiveFilter(searchTerm === 'All' ? '' : searchTerm);
//     };

//     const filteredMenuItems = menuItems
//         .filter((item) => !activeFilter || item.name.toLowerCase().includes(activeFilter.toLowerCase()));

//     return (
//         <>
//             <header className='header'>
//                 <img className='header-image1' src='https://dynamic.brandcrowd.com/template/preview/design/76980f87-fd90-4db1-8705-84dd0bee2496?v=4&designTemplateVersion=1&size=design-preview-standalone-1x' alt='Header' />
//             </header>

//             {/* Container for filter buttons aligned to the right */}
//             <div className="filter-container">
//                 {['All', ...Array.from(new Set(menuItems.map((item) => item.category)))].map((category) => (
//                     <button id='FilterBut' key={category} onClick={() => toggleFilter(category)}>
//                         {category}
//                     </button>
//                 ))}
//             </div>

//             {/* Container for restaurant menu items */}
//             <div className="restaurant-menu">
//                 {filteredMenuItems.map((item) => (
//                     <div className="menu-item" key={item.id}>
//                         <img className="menu-item-image" src={item.image} alt={item.name} />
//                         <h3 className="menu-item-title">{item.name}</h3>
//                         <p className="menu-item-description">{item.description}</p>
//                         <p className="menu-item-price">${item.price.toFixed(2)}</p>
//                         <button className="order-btn" onClick={() => handleOrderNow(item)}>
//                             Order Now
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Order Options Popup */}
//             <OrderOptionsPopup
//                 isOpen={showPopup}
//                 onRequestClose={handleCancelOrder}
//                 onConfirmOrder={handleConfirmOrder}
//                 selectedItem={selectedItem}
//             />

//             {/* Cart */}
//         </>
//     );
// };

// export default RestaurantMenu;
