// // PaymentPage.tsx

// import React, { useState } from 'react';
// import { useCart } from '../context/CartContext';
// import './Payment.css';

// const PaymentPage: React.FC = () => {
//     const { cartItems, totalItems } = useCart();
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('creditCard');
//     const [cardNumber, setCardNumber] = useState<string>('');
//     const [cardDate, setCardDate] = useState<string>('');
//     const [cardCvv, setCardCvv] = useState<string>('');
//     const [cardHolderName, setCardHolderName] = useState<string>('');
//     const [manualPaymentDetails, setManualPaymentDetails] = useState<string>('');

//     const calculateTotalPrice = () => {
//         return cartItems.reduce((total: number, item: { price: number; quantity: number }) => total + item.price * item.quantity, 0);
//     };

//     const handleCreditCardPayment = () => {
//         // Validate credit card details
//         if (!validateCreditCard()) {
//             alert('Invalid credit card details. Please check your card number, date, CVV, and card holder name.');
//             return;
//         }

//         // Implement credit card payment logic
//         alert('Redirecting to Credit Card payment page...');
//     };

//     const validateCreditCard = () => {
//         // Check if card number has 16 digits
//         if (cardNumber.length !== 16) {
//             return false;
//         }

//         // Check if CVV has 3 digits
//         if (cardCvv.length !== 3) {
//             return false;
//         }

//         // Check if date has the format MM/YY
//         const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
//         if (!dateRegex.test(cardDate)) {
//             return false;
//         }

//         // Check if card holder name is not empty
//         if (cardHolderName.trim() === '') {
//             return false;
//         }

//         return true;
//     };

//     const handlePayPalPayment = () => {
//         // Implement PayPal payment logic (e.g., redirecting to PayPal's website)
//         alert('Redirecting to PayPal login...');
//     };

//     const handleManualPayment = () => {
//         // Implement manual payment logic
//         alert('Manual payment received. Thank you for your purchase.');
//     };

//     const handlePayment = () => {
//         if (selectedPaymentMethod === 'creditCard') {
//             handleCreditCardPayment();
//         } else if (selectedPaymentMethod === 'paypal') {
//             handlePayPalPayment();
//         } else if (selectedPaymentMethod === 'manual') {
//             handleManualPayment();
//         }
//     };

//     return (
//         <div className="payment-page">
//             <h2>Checkout</h2>

//             <div className="cart-items">
//                 {/* ... (unchanged) */}
//             </div>

//             <div className="total">
//                 <span>Total Items: {totalItems}</span>
//                 <span>Total Price: ${calculateTotalPrice().toFixed(2)}</span>
//             </div>

//             <div className="payment-methods">
//                 <label>
//                     <input
//                         type="radio"
//                         value="creditCard"
//                         checked={selectedPaymentMethod === 'creditCard'}
//                         onChange={() => setSelectedPaymentMethod('creditCard')}
//                     />
//                     Credit Card
//                 </label>
//                 <label>
//                     <input
//                         type="radio"
//                         value="paypal"
//                         checked={selectedPaymentMethod === 'paypal'}
//                         onChange={() => setSelectedPaymentMethod('paypal')}
//                     />
//                     PayPal
//                 </label>
//                 <label>
//                     <input
//                         type="radio"
//                         value="manual"
//                         checked={selectedPaymentMethod === 'manual'}
//                         onChange={() => setSelectedPaymentMethod('manual')}
//                     />
//                     Manual Payment
//                 </label>
//             </div>

//             {selectedPaymentMethod === 'creditCard' && (
//                 <div className="credit-card-form">
//                     <label>
//                         Card Holder Name:
//                         <input
//                             type="text"
//                             value={cardHolderName}
//                             onChange={(e) => setCardHolderName(e.target.value)}
//                         />
//                     </label>
//                     <label>
//                         Card Number:
//                         <input placeholder='****-****-****-****'
//                             type="text"
//                             value={cardNumber}
//                             onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
//                         />
//                     </label>
//                     <label>
//                         Expiry Date (MM/YY):
//                         <input placeholder='02/23'
//                             type="text"
//                             value={cardDate}
//                             onChange={(e) => setCardDate(e.target.value.replace(/\D/g, ''))}
//                         />
//                     </label>
//                     <label>
//                         CVV:
//                         <input placeholder='***'
//                             type="text"
//                             value={cardCvv}
//                             onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
//                         />
//                     </label>
//                 </div>
//             )}

//             {selectedPaymentMethod === 'manual' && (
//                 <div className="manual-payment-form">
//                     <label>
//                         Self pick / Delivery
//                     </label>
//                 </div>
//             )}

//             <button className="pay-button" onClick={handlePayment}>
//                 Pay Now
//             </button>
//         </div>
//     );
// };

// export default PaymentPage;
