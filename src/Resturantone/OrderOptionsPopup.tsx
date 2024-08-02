// // OrderOptionsPopup.tsx

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import './OrderOptionsPopup.css';

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
//   selectedOptions: string[];
//   comments: string;
//   originalPrice: number;
// }

// interface MenuItem {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   options: string[];
// }

// interface OrderOptionsPopupProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   onConfirmOrder: (cartItem: CartItem) => void;
//   selectedItem: MenuItem | null;
// }

// const OrderOptionsPopup: React.FC<OrderOptionsPopupProps> = ({
//   isOpen,
//   onRequestClose,
//   onConfirmOrder,
//   selectedItem,
// }) => {
//   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
//   const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   const [comments, setComments] = useState<string>('');
//   const { addToCart } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const calculatedPrice =
//       (selectedItem?.price || 0) * quantity +
//       selectedOptions.length * 2 +
//       (selectedRadio ? 5 : 0);
//     setTotalPrice(calculatedPrice);
//   }, [selectedOptions, selectedRadio, selectedItem, quantity]);

//   const handleOptionToggle = (option: string, event: React.ChangeEvent<HTMLInputElement>) => {
//     event.stopPropagation();
//     setSelectedOptions((prevOptions) =>
//       prevOptions.includes(option)
//         ? prevOptions.filter((prevOption) => prevOption !== option)
//         : [...prevOptions, option]
//     );
//   };

//   const handleRadioChange = (option: string, event: React.ChangeEvent<HTMLInputElement>) => {
//     event.stopPropagation();
//     setSelectedRadio((prevRadio) => (prevRadio === option ? null : option));
//   };

//   const handleQuantityIncrement = () => {
//     setQuantity((prevQuantity) => prevQuantity + 1);
//   };

//   const handleQuantityDecrement = () => {
//     setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
//   };

//   const handleCommentsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setComments(event.target.value);
//   };

//   const handleConfirm = () => {
//     const cartItem: CartItem = {
//       id: selectedItem?.id || 0,
//       name: selectedItem?.name || '',
//       price: selectedItem?.price || 0,
//       quantity: quantity,
//       image: selectedItem?.image || '',
//       selectedOptions: [...selectedOptions],
//       comments: comments,
//       originalPrice: selectedItem?.price || 0,
//     };

//     if (selectedRadio) {
//       cartItem.price += 5;
//       cartItem.comments = `Chose option: ${selectedRadio}. ${comments}`;
//     }

//     onConfirmOrder(cartItem);
//     addToCart(cartItem);
//     onRequestClose();
//   };

//   const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.stopPropagation();
//   };

//   return (
//     <>
//       {isOpen && (
//         <div id="All">
//           <div id="AllPop">
//             <div className="popup-overlay" onClick={onRequestClose}>
//               <div className="popup" onClick={handleOverlayClick}>
//                 <img
//                   className="popup-item-image"
//                   src={selectedItem?.image}
//                   alt={selectedItem?.name}
//                 />
//                 <div className="popup-item-details">
//                   <h2 className="popup-item-title">{selectedItem?.name}</h2>
//                   <p className="popup-item-price">${totalPrice.toFixed(2)}</p>
//                   <div className="popup-options">
//                     {selectedItem?.options.map((option: string) => (
//                       <label key={option}>
//                         <input
//                           type="checkbox"
//                           value={option}
//                           checked={selectedOptions.includes(option)}
//                           onChange={(e) => handleOptionToggle(option, e)}
//                         />
//                         {option}
//                         <div className="choice-circle"></div>
//                       </label>
//                     ))}
//                   </div>
//                   <div className="radio-options">
//                     {['Option1', 'Option2', 'Option3'].map((option) => (
//                       <label key={option}>
//                         <input
//                           type="radio"
//                           name="customRadio"
//                           value={option}
//                           checked={selectedRadio === option}
//                           onChange={(e) => handleRadioChange(option, e)}
//                         />
//                         {option}
//                         <div className="choice-circle"></div>
//                       </label>
//                     ))}
//                   </div>
//                   <div className="quantity-input">
//                     <label>Quantity:</label>
//                     <div className="quantity-arrows">
//                       <div className="arrow" onClick={handleQuantityDecrement}>
//                         -
//                       </div>
//                       <div className="quantity">{quantity}</div>
//                       <div className="arrow" onClick={handleQuantityIncrement}>
//                         +
//                       </div>
//                     </div>
//                   </div>
//                   <div className="comment-input">
//                     <label>Comments:</label>
//                     <textarea
//                       rows={4}
//                       placeholder="Add comments"
//                       onChange={handleCommentsChange}
//                     />
//                   </div>
//                   <button
//                     className="popup-confirm-btn"
//                     onClick={() => {
//                       handleConfirm();
//                     }}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderOptionsPopup;
