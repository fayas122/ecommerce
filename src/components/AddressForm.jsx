import React, { useState } from "react";
import { updateUserAddress } from "../services/userApi";
import toast from "react-hot-toast";

const AddressForm = ({ user, onSaved }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedUser = await updateUserAddress(
        user.id,
        formData
      );

      onSaved(updatedUser);
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
    toast.success("Address saved successfully!")
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Delivery Address
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          Please enter your delivery details to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <textarea
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              required
              rows="3"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
              placeholder="House name, street, area"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
                placeholder="City"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
                placeholder="State"
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
              placeholder="Pincode"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Address & Continue"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddressForm;