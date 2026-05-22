import React, { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { convertNgnToSats, formatCurrencyFromSats } from '../utils/formatCurrency';

interface InventoryPageProps {
  onBack: () => void;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ onBack }) => {
  const { products, addProduct, removeProduct } = useProductStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>('');

  const [name, setName] = useState('');
  const [priceNgn, setPriceNgn] = useState('');

 const handleAdd = () => {
  if (!name || !priceNgn || !imageFile) return;

  const ngn = Number(priceNgn);
  const sats = convertNgnToSats(ngn);

  addProduct({
    id: crypto.randomUUID(),
    name,
    image: imagePreview, // 👈 use preview URL for now
    priceNgn: ngn,
    pricesats: sats,
  });

  setName('');
  setPriceNgn('');
  setImageFile(null);
  setImagePreview('');
};

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
};
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={onBack} className="text-black font-medium">
          Back
        </button>
        <h1 className="text-md text-black">Inventory</h1>
        <div className="w-12" />
      </div>

      {/* Form */}
<div className="p-4 space-y-3 border-b">

  <input
    placeholder="Product name"
    className="w-full border p-2 rounded text-black placeholder-gray-400"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    placeholder="Price in Naira"
    className="w-full border p-2 rounded text-black placeholder-gray-400"
    value={priceNgn}
    onChange={(e) => setPriceNgn(e.target.value)}
  />
<p className="text-xs text-gray-500">
  Upload product image (recommended: square image)
</p>
  <input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  className="w-full border p-2 rounded text-black"
/>
{imagePreview && (
  <img
    src={imagePreview}
    alt="Preview"
    className="w-full h-40 object-cover rounded mt-2 border"
  />
)}

  <button
    onClick={handleAdd}
    className="w-full bg-black text-white p-2 rounded"
  >
    Add Product
  </button>
</div>

      {/* List */}
      <div className="p-4 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-3 flex gap-3">
            <img src={p.image} className="w-16 h-16 object-cover rounded" />

            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-600">
                {formatCurrencyFromSats(p.pricesats)}
              </p>
            </div>

            <button
              onClick={() => removeProduct(p.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;