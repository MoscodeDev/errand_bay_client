import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const TrackErrands = () => {
  const [errands, setErrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingErrands, setIsLoadingErrands] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const { data: Myorders, error } = await supabase.from("orders").select(`
        id,
        user_id,
        status,
        created_at,
        order_items!fk_order(
          id,
          quantity,
          price,
          product:product_id (
            id,
            name,
            price
          )
        )
      `);

        if (error) {
          toast.error("Failed to fetch orders");
          return;
        }

        setOrders(Myorders);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Something went wrong while fetching orders");
      } finally {
        setIsLoadingOrders(false);
      }
    };

    getOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingErrands(true); // Start loading
      try {
        const { data, error } = await supabase
          .from("errands")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          toast.error("Error fetching errands");
          return;
        }

        setErrands(data);
      } catch (err) {
        console.error("Unexpected error fetching errands:", err);
        toast.error("Something went wrong. Try again.");
      } finally {
        setIsLoadingErrands(false); // Stop loading in all cases
      }
    };

    fetchOrders();
  }, []);

  if(isLoadingErrands || isLoadingOrders) return <LoadingSpinner />

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* ERRANDS SECTION */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Errands</h2>
        {errands.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {errands.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Errand #{order.id.slice(0, 8)}
                </h3>
                <p className="text-gray-700">
                  <strong>Pickup:</strong> {order.pickupLocation}
                </p>
                <p className="text-gray-700">
                  <strong>Dropoff:</strong> {order.dropoffLocation}
                </p>
                <p className="text-gray-700">
                  <strong>Item:</strong> {order.itemDescription}
                </p>
                <p className="text-gray-700">
                  <strong>Delivery:</strong>{" "}
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No Errands found</p>
        )}
      </div>

      {/* ORDERS SECTION */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <span
                    className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-4">
                  Placed on {new Date(order.created_at).toLocaleString()}
                </p>

                <div>
                  <h4 className="font-medium mb-2 text-gray-800">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Product ID: {item.product.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-800 font-semibold">
                            Ksh.{item.product.price}
                          </p>
                          <p className="text-sm text-gray-400">
                            Subtotal: Ksh. {item.quantity * item.product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackErrands;
