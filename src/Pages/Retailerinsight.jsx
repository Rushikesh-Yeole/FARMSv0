import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Sprout, TrendingUp, AlertCircle, List, CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchStockListings } from "../store/FarmerDashBoard/stocklistingSlice";

export default function Retailerinsight() {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [marketInsights, setMarketInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);
  const [crops, setCrops] = useState([]);
  const [narrowInsights, setNarrowInsights] = useState(null);
  const [narrowLoading, setNarrowLoading] = useState(false);
  const [narrowError, setNarrowError] = useState(null);

  const cropImages = {
    onion: "https://example.com/onion.jpg",
    potato: "https://example.com/potato.jpg",
    tomato: "https://example.com/tomato.jpg",
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const result = await dispatch(fetchStockListings());
        const response = result.payload;
        if (response && response.stocks) {
          const cropList = response.stocks.map(stock => stock.crop);
          setCrops(cropList);
          setRegion(response.stocks[0]?.village || "Unknown");

          const maxCrop = response.stocks.reduce((max, stock) =>
            stock.quantity > max.quantity ? stock : max, response.stocks[0]);
          setSelectedProduct(maxCrop?.crop || "");
        }
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setCrops([]);
      }
    };
    fetchStocks();
  }, [dispatch]);

  useEffect(() => {
    if (!region || !selectedProduct) return;

    const fetchMarketInsights = async () => {
      setLoading(true);
      try {
        const response = await axios.post("https://farms-engine.onrender.com/insights", {
          region:"nashik",
          product: "rice",
        }, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setMarketInsights(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch market insights.");
      }
      setLoading(false);
    };
    fetchMarketInsights();
  }, [region, selectedProduct]);

  useEffect(() => {
    const fetchNarrowInsights = async () => {
      setNarrowLoading(true);
      try {
        const response = await axios.get('https://farms-engine.onrender.com/narrowInsights/6799016d06a2f18aaae17152');
        setNarrowInsights(response.data);
        setNarrowError(null);
      } catch (err) {
        setNarrowError('Failed to fetch narrow insights');
      }
      setNarrowLoading(false);
    };
    fetchNarrowInsights();
  }, []);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-green-800">Market Insights</h1>
          </div>
          
        </motion.div>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Add heading for first card */}
          <div className="bg-green-600 p-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Retailer Real-Time Insights
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 flex items-center justify-center bg-gray-50">
              <div className="w-full h-full max-h-[500px] relative rounded-2xl overflow-hidden p-4">
                {selectedProduct && cropImages[selectedProduct.toLowerCase()] ? (
                  <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                    src={cropImages[selectedProduct.toLowerCase()]} alt={selectedProduct}
                    className="w-full h-full object-cover rounded-2xl shadow-lg" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <p className="text-gray-500 text-lg">Select a crop to view details</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8">
              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-700 mb-3">Select Crop to order</label>
                <select value={selectedProduct} onChange={handleProductChange}
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg">
                  {crops.map((crop, index) => (
                    <option key={index} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              {loading ? (
                <p className="text-center text-blue-600 font-semibold">Loading market insights...</p>
              ) : error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
              ) : selectedProduct && marketInsights && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className={`p-6 rounded-lg ${marketInsights.percent_gap > 10 ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"}`}>
                    <div className="flex items-start gap-4">
                      {marketInsights.percent_gap > 10 ? <TrendingUp className="w-6 h-6 text-green-600" /> : <AlertCircle className="w-6 h-6 text-red-600" />}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Market Analysis</h3>
                        <p className="text-lg">{marketInsights.message}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
         
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-10">
          {/* Add heading for second card */}
          <div className="bg-green-600 p-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Reatailer insight with faorcasting 
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 flex items-center justify-center bg-gray-50">
              <div className="w-full h-full max-h-[500px] relative rounded-2xl overflow-hidden p-4">
                {selectedProduct && cropImages[selectedProduct.toLowerCase()] ? (
                  <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                    src={cropImages[selectedProduct.toLowerCase()]} alt={selectedProduct}
                    className="w-full h-full object-cover rounded-2xl shadow-lg" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <p className="text-gray-500 text-lg">Select a crop to view details</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8">
              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-700 mb-3">Select Your Crop</label>
                <select value={selectedProduct} onChange={handleProductChange}
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg">
                  {crops.map((crop, index) => (
                    <option key={index} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              {loading ? (
                <p className="text-center text-blue-600 font-semibold">Loading market insights...</p>
              ) : error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
              ) : selectedProduct && marketInsights && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className={`p-6 rounded-lg ${marketInsights.percent_gap > 10 ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"}`}>
                    <div className="flex items-start gap-4">
                      {marketInsights.percent_gap > 10 ? <TrendingUp className="w-6 h-6 text-green-600" /> : <AlertCircle className="w-6 h-6 text-red-600" />}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Market Analysis</h3>
                        <p className="text-lg">{marketInsights.message}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        

        <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-10">
          <div className="bg-green-600 p-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Shopkeeper Narrow Insight
            </h2>
          </div>
          <div className="p-8">
            {narrowLoading ? (
              <p className="text-center text-blue-600 font-semibold">Loading narrow insights...</p>
            ) : narrowError ? (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">{narrowError}</div>
            ) : narrowInsights && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-6"
              >
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <List className="w-6 h-6 text-green-600 mt-1" />
                    <h3 className="text-xl font-semibold text-green-800">
                      Market Instructions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {narrowInsights.instructions?.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        <p className="text-gray-700">{instruction}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {narrowInsights.additionalInfo && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-3">
                      Additional Information
                    </h4>
                    <p className="text-gray-700">{narrowInsights.additionalInfo}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
