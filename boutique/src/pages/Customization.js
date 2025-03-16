// boutique/src/pages/Customization.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

const Customization = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [dressType, setDressType] = useState(''); // State for dress type
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [materials, setMaterials] = useState([]); // State for materials
  const [length, setLength] = useState('');
  const [additionalWorks, setAdditionalWorks] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]); // Materials based on selected category
  const [buttonCount, setButtonCount] = useState(0); // State for number of buttons
  const [designOptions, setDesignOptions] = useState([]); // State for design options
  const [measurements, setMeasurements] = useState({}); // State for measurements
  const [colorPalette, setColorPalette] = useState(''); // State for selected color from palette
  const [stitchingRequirements, setStitchingRequirements] = useState(''); // State for stitching requirements
  const [designImage, setDesignImage] = useState(null); // State for uploaded design image
  const [sleeveDesign, setSleeveDesign] = useState(''); // State for sleeve design
  const [neckDesign, setNeckDesign] = useState(''); // State for neck design
  const [errors, setErrors] = useState({}); // State for error messages
  const [showPlaceOrder, setShowPlaceOrder] = useState(false); // State to control visibility of Place Order button
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/materials'); // Fetch all materials
        setMaterials(response.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    // Filter materials based on selected category
    const filteredMaterials = materials.filter(material => material.category === category);
    setAvailableMaterials(filteredMaterials);
    setSelectedMaterial(null); // Reset selected material
    setDesignOptions([]); // Reset design options
    setTotalPrice(0); // Reset total price
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial(material._id);
    // Fetch design options based on selected material (mock data for example)
    setDesignOptions(material.designs || []); // Assuming each material has a designs array
    // Update total price based on selected material price
    setTotalPrice(material.price); // Assuming each material has a price property
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesignImage(URL.createObjectURL(file)); // Create a URL for the uploaded image
    }
  };

  const validateFields = () => {
    const newErrors = {};
    // Validate required fields
    if (!selectedCategory) newErrors.category = "Material category is required.";
    if (!selectedMaterial) newErrors.material = "Material selection is required.";
    if (!dressType) newErrors.dressType = "Dress type is required.";
    if (!sleeveDesign) newErrors.sleeveDesign = "Sleeve design is required.";
    if (!neckDesign) newErrors.neckDesign = "Neck design is required.";
    
    // Validate measurements
    const measurementFields = ['chest', 'waist', 'hip', 'shoulderWidth', 'armLength', 'thighCircumference', 'inseam'];
    measurementFields.forEach(field => {
      const value = measurements[field];
      if (!value) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      } else if (isNaN(value) || value <= 0) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return; // Stop submission if validation fails

    // Show the Place Order button
    setShowPlaceOrder(true);
  };

  const handlePlaceOrder = async () => {
    // Prepare order data
    const orderData = {
      selectedCategory,
      selectedMaterial,
      dressType,
      sleeveDesign,
      neckDesign,
      measurements,
      additionalNotes,
      stitchingRequirements,
      designImage,
      totalPrice, // Include total price in order data
    };

    try {
      // Simulate order placement (replace with actual API call)
      await axios.post('http://localhost:8080/api/orders', orderData); // Adjust the endpoint as needed
      console.log('Order placed successfully:', orderData);
      // Navigate to checkout page
      navigate('/checkout'); // Change this to the desired checkout route
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Customization Page</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Select Material Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Fabric">Fabric</option>
            <option value="Laces">Laces</option>
            <option value="Buttons">Buttons</option>
            <option value="Zippers">Zippers</option>
            <option value="Threads">Threads</option>
            <option value="Ribbons">Ribbons</option>
            <option value="Beads">Beads</option>
            <option value="Sequins">Sequins</option>
            <option value="Elastic">Elastic</option>
            <option value="Interfacing">Interfacing</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs italic">{errors.category}</p>}
        </div>

        {selectedCategory && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Select Material</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableMaterials.map((material) => (
                <div
                  key={material._id}
                  className={`border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${selectedMaterial === material._id ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleMaterialChange(material)}
                >
                  <img
                    src={`http://localhost:8080/${material.image.replace('\\', '/')}`} // Adjust the image path as needed
                    alt={material.description}
                    className="w-full h-32 object-cover rounded-t-lg" // Full width and fixed height
                  />
                  <div className="p-4">
                    <h3 className="text-md font-semibold">{material.description}</h3>
                    <p className="text-gray-600">Price: ${material.price.toFixed(2)}</p> {/* Display price */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dressType">
            Dress Type
          </label>
          <select
            id="dressType"
            value={dressType}
            onChange={(e) => setDressType(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select dress type</option>
            <option value="Churidar">Churidar</option>
            <option value="Skirt">Skirt</option>
            <option value="Top">Top</option>
            <option value="Blouse">Blouse</option>
            <option value="Pants">Pants</option>
            <option value="Shirt">Shirt</option>
            <option value="Lehenga">Lehenga</option>
            <option value="Kurti">Kurti</option>
            <option value="Coat">Coat</option>
          </select>
          {errors.dressType && <p className="text-red-500 text-xs italic">{errors.dressType}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sleeveDesign">
            Sleeve Design
          </label>
          <select
            id="sleeveDesign"
            value={sleeveDesign}
            onChange={(e) => setSleeveDesign(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select sleeve design</option>
            <option value="Short Sleeve">Short Sleeve</option>
            <option value="Long Sleeve">Long Sleeve</option>
            <option value="Sleeveless">Sleeveless</option>
            <option value="Cap Sleeve">Cap Sleeve</option>
            <option value="Bell Sleeve">Bell Sleeve</option>
            <option value="Puff Sleeve">Puff Sleeve</option>
          </select>
          {errors.sleeveDesign && <p className="text-red-500 text-xs italic">{errors.sleeveDesign}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="neckDesign">
            Neck Design
          </label>
          <select
            id="neckDesign"
            value={neckDesign}
            onChange={(e) => setNeckDesign(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select neck design</option>
            <option value="Round Neck">Round Neck</option>
            <option value="V Neck">V Neck</option>
            <option value="Square Neck">Square Neck</option>
            <option value="Boat Neck">Boat Neck</option>
            <option value="High Neck">High Neck</option>
            <option value="Collared Neck">Collared Neck</option>
          </select>
          {errors.neckDesign && <p className="text-red-500 text-xs italic">{errors.neckDesign}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Measurements (in cm)</label>
          <input
            type="text"
            name="chest"
            placeholder="Chest Measurement (cm)"
            onChange={handleMeasurementChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.chest && <p className="text-red-500 text-xs italic">{errors.chest}</p>}
          <input
            type="text"
            name="waist"
            placeholder="Waist Measurement (cm)"
            onChange={handleMeasurementChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.waist && <p className="text-red-500 text-xs italic">{errors.waist}</p>}
          <input
            type="text"
            name="hip"
            placeholder="Hip Measurement (cm)"
            onChange={handleMeasurementChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.hip && <p className="text-red-500 text-xs italic">{errors.hip}</p>}
          <input
            type="text"
            name="shoulderWidth"
            placeholder="Shoulder Width (cm)"
            onChange={handleMeasurementChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.shoulderWidth && <p className="text-red-500 text-xs italic">{errors.shoulderWidth}</p>}
          <input
            type="text"
            name="armLength"
            placeholder="Arm Length (cm)"
            onChange={handleMeasurementChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.armLength && <p className="text-red-500 text-xs italic">{errors.armLength}</p>}
          <input
            type="text"
            name="thighCircumference"
            placeholder="Thigh Circumference (cm)"
            onChange={handleMeasurementChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.thighCircumference && <p className="text-red-500 text-xs italic">{errors.thighCircumference}</p>}
          <input
            type="text"
            name="inseam"
            placeholder="Inseam Length (cm)"
            onChange={handleMeasurementChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.inseam && <p className="text-red-500 text-xs italic">{errors.inseam}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload Design Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {designImage && (
            <div className="mt-2">
              <img src={designImage} alt="Uploaded Design" className="w-32 h-32 object-cover" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Stitching Requirements</label>
          <textarea
            id="stitchingRequirements"
            value={stitchingRequirements}
            onChange={(e) => setStitchingRequirements(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows="4"
            placeholder="Enter detailed stitching requirements here..."
          />
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Total Price: Rs.{totalPrice.toFixed(2)}</h2> {/* Display total price */}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Submit Customization
        </button>

        {showPlaceOrder && (
         <button
         onClick={() => navigate('/checkout')} // Navigate to the checkout page
         className="mt-4 text-blue-500 hover:underline"
       >
         Place Order
       </button>
        )}
      </form>
      <button
        onClick={() => navigate('/')} // Navigate back to the catalog
        className="mt-4 text-blue-500 hover:underline"
      >
        Back to Catalog
      </button>
    </div>
  );
};

export default Customization;