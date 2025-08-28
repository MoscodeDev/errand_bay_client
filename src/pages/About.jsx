import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4 text-blue-600">
        About Us
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Welcome to <span className="font-semibold">Errand Bay</span>, your
        trusted partner for errands and product delivery. We make it easy for
        you to send and receive items with just a few taps, saving you time and
        effort.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="bg-blue-50 p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            Our Mission
          </h2>
          <p className="text-gray-700">
            To simplify errands and logistics for individuals and businesses by
            providing a fast, reliable, and secure platform for product
            delivery.
          </p>
        </div>

        <div className="bg-blue-50 p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Fast and reliable delivery</li>
            <li>Affordable and transparent pricing</li>
            <li>Secure transactions</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Explore Our Products
        </Link>
      </div>
    </div>
  );
};

export default About;
