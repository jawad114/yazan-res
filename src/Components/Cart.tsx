// // Cart.tsx
// import React, { useState } from 'react';
// import { useCart } from '../context/CartContext';
// import MapComponent from './MapComponent';
// import './Cart.css';
// import { Link } from 'react-router-dom';

// const Cart: React.FC = () => {
//   const { cartItems, removeFromCart } = useCart();
//   const [deliveryOption, setDeliveryOption] = useState<'selfPickup' | 'customerLocation'>('selfPickup');
//   const [customerLocationAccepted, setCustomerLocationAccepted] = useState(false);

//   // Calculate the total price
//   const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//   return (
//     <div className="cart-container">
//       <h2 className="cart-title">Cart</h2>

//       {cartItems.length === 0 && (
//         <p className="empty-cart-message" style={{ color: 'red' }}>
//           Cart is empty. Please add items to your cart before checking out.
//         </p>
//       )}

//       <ul className="cart-list">
//         {cartItems.map((item) => (
//           <li key={item.id} className="cart-item">
//             <img src={item.image} alt={item.name} className="cart-item-image" />
//             <div className="cart-item-details">
//               <h3 className="cart-item-name">{item.name}</h3>
//               <p className="cart-item-quantity">Quantity: {item.quantity}</p>
//               <p className="cart-item-price">Price: ${item.price.toFixed(2)}</p>
//               {item.selectedOptions.length > 0 && (
//                 <p className="cart-item-options">
//                   Selected Options: {item.selectedOptions.join(', ')}
//                 </p>
//               )}
//               {item.comments && <p className="cart-item-comments">Comments: {item.comments}</p>}
//               <button
//                 className="cart-item-remove-btn"
//                 onClick={() => {
//                   removeFromCart(item.id);
//                 }}
//               >
//                 X
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <div className="delivery-option">
//         <div className="cart-total">
//           <p className="cart-total-label">Total Price:</p>
//           <p className="cart-total-amount">${totalPrice.toFixed(2)}</p>
//         </div>
//         <label>
//           <h1 id='Delivery'>Choose Delivery Way</h1>
//           <input
//             type="radio"
//             value="selfPickup"
//             checked={deliveryOption === 'selfPickup'}
//             onChange={() => setDeliveryOption('selfPickup')}
//             disabled={cartItems.length === 0} // Disable if cart is empty
//           />
//           Self Pickup
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="customerLocation"
//             checked={deliveryOption === 'customerLocation'}
//             onChange={() => setDeliveryOption('customerLocation')}
//             disabled={cartItems.length === 0} // Disable if cart is empty
//           />
//           Delivery to Customer Location
//         </label>
//       </div>

//       {/* Conditionally render the map if customer location is selected */}
//       {deliveryOption === 'customerLocation' && !customerLocationAccepted && (
//         <div className="map-container">
//           <MapComponent />
//           {/* Add a button to trigger location acceptance */}
//           <button onClick={() => setCustomerLocationAccepted(true)}>Accept Location</button>
//         </div>
//       )}

//       <div id="submit" className="cart-submit2">
//         {cartItems.length > 0 ? (
//           <Link to="/Checkout" className='action-btn2'>
//             Checkout
//           </Link>
//         ) : (
//           <Link to="/" className='action-btn3'>
//             Order Now
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;
