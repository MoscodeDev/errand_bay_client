import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputField from "../components/InputField";
import TextArea from "../components/TextArea";
import { supabase } from "../supabaseClient";

const LandingPage = ({ user }) => {
  const [inspectPackage, setinspectPackage] = useState(false);
  const [formData, setFormData] = useState({
    client: user?.id || "",
    pickupLocation: "",
    dropoffLocation: "",
    itemDescription: "",
    inspect: inspectPackage,
    deliveryDate: "",
    inspectPackageDescription: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        client: user.id,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { pickupLocation, dropoffLocation, itemDescription } = formData;

    if (!pickupLocation || !dropoffLocation || !itemDescription || !formData.client) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await supabase.from("errands").insert([formData]).select();
      if (res.error) {
        toast.error(res.error.message);
        console.log(res.error);
        setLoading(false);
        return;
      }

      toast.success("Your errand request has been submitted! We will contact you soon.");
      setFormData({
        pickupLocation: "",
        dropoffLocation: "",
        itemDescription: "",
        deliveryDate: "",
        inspectPackageDescription: "",
      });
      setinspectPackage(false);
    } catch (error) {
      toast.error("Failed to submit errand request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full md:w-[450px] bg-white shadow-lg rounded-lg p-5">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Request an Errand
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextArea
            inputDetails={{
              label: "Item(s) *",
              name: "itemDescription",
              itemDescription: formData.itemDescription,
              value: formData.itemDescription,
              placeholder: "Describe the item(s)",
              handleChange: handleChange,
            }}
          />
          <InputField
            inputDetails={{
              label: "Pickup Location *",
              type: "text",
              name: "pickupLocation",
              value: formData.pickupLocation,
              handleChange: handleChange,
            }}
          />

          <InputField
            inputDetails={{
              label: "Drop-off Location *",
              type: "text",
              name: "dropoffLocation",
              value: formData.dropoffLocation,
              handleChange: handleChange,
            }}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="nispectPackage"
              checked={inspectPackage}
              onChange={() => {
                setinspectPackage(!inspectPackage);
                setFormData((prev) => ({
                  ...prev,
                  inspect: !inspectPackage,
                }));
              }}
            />
            <label htmlFor="nispectPackage" className="text-blue-700">
              Inspect Package
            </label>
          </div>

          {inspectPackage && (
            <TextArea
              inputDetails={{
                label: "Inspection Details",
                name: "inspectPackageDescription",
                itemDescription: formData.inspectPackageDescription,
                value: formData.inspectPackageDescription,
                placeholder: "Describe inspection details",
                handleChange: handleChange,
              }}
            />
          )}

          <InputField
            inputDetails={{
              type: "date",
              label: "Delivery Date",
              name: "deliveryDate",
              handleChange: handleChange,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
