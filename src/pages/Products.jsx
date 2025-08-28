import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { ShoppingCart, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import FilterPanel from "../components/FilterPanel";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
          return;
        }

        setProducts(products);

        // ✅ Extract unique categories
        const uniqueCategories = [
          ...new Set(products.map((product) => product.category).filter(Boolean))
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
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

  if (loading) return <LoadingSpinner />;

  // ✅ Apply search, filter, and sorting
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => (category ? product.category === category : true))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter size={18} /> Filter & Sort
        </button>
      </div>

      {/* Filters for Desktop */}
      <div className="hidden md:flex justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-1/3 border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Mobile Filter Panel */}
      {isFilterOpen && (
        <FilterPanel
          setIsFilterOpen={setIsFilterOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          categories={categories} // ✅ Pass categories dynamically
        />
      )}

      {/* Product Grid */}
      <div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-xl transition duration-300"
              >
                {/* Product Image */}
                <div
                  className="w-full h-48 bg-white flex items-center justify-center"
                  onClick={() =>
                    navigate(
                      `/description/${product.name.replace(/\s+/g, "-")}/${product.id}`
                    )
                  }
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-blue-600">
                      Ksh. {product.price}
                    </span>
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {product?.category || "Uncategorized"}
                    </span>
                  </div>

                  <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg mt-10">No products found</div>
        )}
      </div>

      {/* Floating Cart Button */}
      <div
        className="fixed bottom-6 right-6 bg-green-500 h-14 w-14 flex items-center justify-center rounded-full shadow-lg cursor-pointer text-white hover:bg-green-600 transition duration-300 md:bottom-10 md:right-10"
        onClick={() => navigate("/cart")}
      >
        <ShoppingCart />
      </div>
    </div>
  );
};

export default Products;
