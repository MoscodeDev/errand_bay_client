import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function Description() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return;
      }
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  if (!product) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft size={20} />
        <span className="text-lg font-medium">Back</span>
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          ) : (
            <span className="text-gray-400">No Image Available</span>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-lg">{product.description || "No description provided."}</p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-2xl font-bold text-blue-600">Ksh. {product.price}</span>
            <span className="text-sm px-4 py-1 bg-blue-100 text-blue-700 rounded-full">
              {product.category || "Uncategorized"}
            </span>
          </div>

          {/* What's in the Box */}
          {product.whats_in_the_box && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">What's in the Box:</h3>
              <p className="text-gray-700">{product.whats_in_the_box}</p>
            </div>
          )}

          {/* Warranty */}
          {product.warranty && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Warranty:</h3>
              <p className="text-gray-700">{product.warranty}</p>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-300"
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
