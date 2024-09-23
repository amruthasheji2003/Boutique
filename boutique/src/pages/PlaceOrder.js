import React, { useState } from 'react';

const PlaceOrder = () => {
  const [dressType, setDressType] = useState('');
  const [fabric, setFabric] = useState('');
  const [color, setColor] = useState('#ffffff'); // Default color
  const [style, setStyle] = useState('');
  const [measurements, setMeasurements] = useState({ bust: '', waist: '', hip: '', length: '' });
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create an order summary
    const summary = {
      dressType,
      fabric,
      color,
      style,
      measurements,
      additionalNotes,
    };
    setOrderSummary(summary);
  };

  const handleConfirmOrder = () => {
    // Here you can add logic to send the order to the backend
    alert('Order placed successfully!');
    // Reset the form
    setDressType('');
    setFabric('');
    setColor('#ffffff');
    setStyle('');
    setMeasurements({ bust: '', waist: '', hip: '', length: '' });
    setAdditionalNotes('');
    setOrderSummary(null);
  };

  return (
    <div className="place-order p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Place Your Order</h1>
      {!orderSummary ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Dress Type</label>
            <select value={dressType} onChange={(e) => setDressType(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Type</option>
              <option value="lehenga">Lehenga</option>
              <option value="frock">Frock</option>
              <option value="churidar">Churidar</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Fabric</label>
            <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Fabric</option>
              <option value="cotton">Cotton</option>
              <option value="silk">Silk</option>
              <option value="georgette">Georgette</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-2">Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select Style</option>
              <option value="sleeveless">Sleeveless</option>
              <option value="full sleeves">Full Sleeves</option>
            </select>
          </div>

          <div>
            <h2 className="font-semibold">Measurements</h2>
            <label className="block mb-2">Bust</label>
            <input type="text" value={measurements.bust} onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })} className="w-full p-2 border rounded" />
            
            <label className="block mb-2">Waist</label>
            <input type="text" value={measurements.waist} onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })} className="w-full p-2 border rounded" />
            
            <label className="block mb-2">Hip</label>
            <input type="text" value={measurements.hip} onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })} className="w-full p-2 border rounded" />
            
            <label className="block mb-2">Length</label>
            <input type="text" value={measurements.length} onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-2">Additional Notes</label>
            <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} className="w-full p-2 border rounded"></textarea>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Review Order</button>
        </form>
      ) : (
        <div className="order-summary p-4 border rounded">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <p><strong>Dress Type:</strong> {orderSummary.dressType}</p>
          <p><strong>Fabric:</strong> {orderSummary.fabric}</p>
          <p><strong>Color:</strong> <span style={{ backgroundColor: orderSummary.color, padding: '5px', borderRadius: '4px' }}>{orderSummary.color}</span></p>
          <p><strong>Style:</strong> {orderSummary.style}</p>
          <p><strong>Measurements:</strong> Bust: {orderSummary.measurements.bust}, Waist: {orderSummary.measurements.waist}, Hip: {orderSummary.measurements.hip}, Length: {orderSummary.measurements.length}</p>
          <p><strong>Additional Notes:</strong> {orderSummary.additionalNotes}</p>

          <button onClick={handleConfirmOrder} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Confirm Order</button>
          <button onClick={() => setOrderSummary(null)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Edit Order</button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
