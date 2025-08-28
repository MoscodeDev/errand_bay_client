import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = ({ user }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    } else {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const saveOrder = async (order, orderItems) => {
    try {
      setIsPlacingOrder(true);
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(order)
        .select()
        .single();

      if (orderError) {
        toast.error("Order failed to submit. Try again.");
        return;
      }

      const itemsWithOrderId = orderItems.map((i) => ({
        ...i,
        order_id: orderData.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsWithOrderId);

      if (itemsError) {
        toast.error("Trouble submitting items.");
        return;
      }

      toast.success("Order submitted successfully 🎉.");
    } catch (error) {
      toast.error("Error detected.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    const order = {
      user_id: user?.id,
      status: "pending",
      amount: total,
      created_at: new Date().toISOString(),
    };

    const orderItems = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await saveOrder(order, orderItems);
    setPaymentAmount(total); // Show the amount in the modal
    setShowPaymentModal(true); // Show payment modal
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {cart.length > 0 ? (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-lg shadow-md gap-4 bg-black/10"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">Price: Ksh. {item.price}</p>
                    <p className="text-gray-600">
                      Total: Ksh. {item.price * item.quantity}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => decreaseQuantity(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    –
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(index)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total */}
          <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold">
              Total: Ksh. {total.toFixed(2)}
            </h2>
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            >
              {isPlacingOrder ? "Placing Order ..." : "Place Order"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-lg">🛒 Your cart is empty</p>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-11/12 max-w-md text-center relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-3 text-gray-800">Complete Your Payment</h2>
            <p className="text-gray-600 mb-6">
              Please pay
              <span className="font-semibold text-blue-600"> Ksh. {paymentAmount.toFixed(2)} </span>
              to the number below to process your order.
            </p>

            {/* Phone Number + Copy Button */}
            <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-lg p-3 mb-4">
              <span className="font-semibold text-lg text-gray-800">0795 360 391</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("0795360391");
                  toast.success("Number copied!");
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>

            {/* Amount Display */}
            <div className="bg-blue-50 text-blue-800 font-semibold p-3 rounded-lg mb-6">
              Amount: Ksh. {paymentAmount.toFixed(2)}
            </div>

            {/* Okay Button */}
            <button
              onClick={() => {
                setShowPaymentModal(false);
                navigate("/products");
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
