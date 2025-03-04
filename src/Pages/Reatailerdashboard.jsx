import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function RetailerDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Dummy order data
  const dummyOrders = [
    {
      _id: "1",
      crop: "Wheat",
      quantity: 50,
      pricePerQuintal: 1200,
      expectedDeliveryDate: "2025-03-10",
      locked: true,
    },
    {
      _id: "2",
      crop: "Rice",
      quantity: 30,
      pricePerQuintal: 1500,
      expectedDeliveryDate: "2025-03-15",
      locked: false,
    },
    {
      _id: "3",
      crop: "Maize",
      quantity: 40,
      pricePerQuintal: 1300,
      expectedDeliveryDate: "2025-03-20",
      locked: true,
    },
  ];

  const handleOnclickviewSupply = (id) => {
    setSelectedSupplier({
      firstName: "Kalpesh",
      lastName: "Shirshat",
      contactNumber: "123-456-7890",
      averageRating: 4.5,
      reliabilityScore: 90,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Retailer Dashboard</h1>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "requests" ? "bg-green-600 text-white" : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Requests
          </div>
        </button>
      </div>

      {/* Order Requests Section */}
      {activeTab === "requests" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg border border-green-200">
          <div className="bg-yellow-50 border-b border-yellow-100 p-4">
            <h2 className="text-lg font-semibold text-yellow-700">Order Requests</h2>
          </div>
          <div className="p-4 space-y-4">
            {dummyOrders.length ? (
              dummyOrders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-green-50 border-green-300">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-green-800">{order.crop}</h3>
                    <span className={`text-sm font-semibold ${order.locked ? "text-green-600" : "text-yellow-600"}`}>
                      {order.locked ? "Accepted" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">Quantity: <span className="font-medium">{order.quantity} Quintals</span></p>
                  <p className="text-sm text-gray-700">Price: <span className="font-medium">₹{order.pricePerQuintal} per Quintal</span></p>
                  <p className="text-sm text-gray-700">Date: <span className="font-medium">{new Date(order.expectedDeliveryDate).toLocaleDateString()}</span></p>
                  {order.locked && (
                    <button
                      onClick={() => handleOnclickviewSupply(order._id)}
                      className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                      View Supplier Details
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Supplier Details</h3>
              <button onClick={() => setSelectedSupplier(null)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="space-y-3">
              <p><span className="font-semibold">Name:</span> {selectedSupplier.firstName} {selectedSupplier.lastName}</p>
              <p><span className="font-semibold">Contact:</span> {selectedSupplier.contactNumber}</p>
              <p><span className="font-semibold">Rating:</span> {selectedSupplier.averageRating}</p>
              <p><span className="font-semibold">Reliability Score:</span> {selectedSupplier.reliabilityScore}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
