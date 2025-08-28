import React from "react";
import { X } from "lucide-react";

const FilterPanel = ({
  setIsFilterOpen,
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  sort,
  setSort,
  categories, // dynamic categories passed as prop
}) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setIsFilterOpen(false);
    }
  };

  return (
    <div
      className="overlay fixed inset-0 bg-black/40 flex justify-end z-50"
      onClick={handleOverlayClick}
    >
      <div className="w-72 md:w-96 bg-white p-5 shadow-lg h-full transform transition-transform duration-300 ease-in-out translate-x-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold">Filter & Sort</h3>
          <button onClick={() => setIsFilterOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-col gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Category */}
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

          {/* Sort */}
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

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setIsFilterOpen(false)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
