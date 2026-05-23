import React, { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { convertNgnToSats, formatCurrencyFromSats } from '../utils/formatCurrency';
import { ScanLine } from 'lucide-react';

interface InventoryPageProps {
  onBack: () => void;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ onBack }) => {
  const { products, addProduct, removeProduct } = useProductStore();

  const [name, setName] = useState('');
  const [priceNgn, setPriceNgn] = useState('');
  const [stock, setStock] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [barcodeError, setBarcodeError] = useState('');

  const handleAdd = () => {
    if (!name || !priceNgn || !barcode.trim() || !imageFile) return;

    if (products.some((p) => p.id === barcode.trim())) {
      setBarcodeError('A product with this barcode already exists.');
      return;
    }

    setBarcodeError('');
    const ngn = Number(priceNgn);

    addProduct({
      id: barcode.trim(),          // barcode becomes the product id
      name,
      image: imagePreview,
      priceNgn: ngn,
      pricesats: convertNgnToSats(ngn),
      stock: Number(stock) || 0,
    });

    setName('');
    setPriceNgn('');
    setStock('');
    setBarcode('');
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const canAdd = name && priceNgn && barcode.trim() && imageFile;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={onBack} className="text-black font-medium">Back</button>
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
          type="number"
          min={0}
          className="w-full border p-2 rounded text-black placeholder-gray-400"
          value={priceNgn}
          onChange={(e) => setPriceNgn(e.target.value)}
        />

        <input
          placeholder="Stock quantity"
          type="number"
          min={0}
          className="w-full border p-2 rounded text-black placeholder-gray-400"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        {/* Barcode — this becomes the product id that the scanner matches against */}
        <div className="space-y-1">
          <div className="relative">
            <ScanLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              placeholder="Barcode (e.g. 6156000211626)"
              className={`w-full border p-2 pl-9 rounded font-mono text-black placeholder-gray-400 ${
                barcodeError ? 'border-red-400' : ''
              }`}
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value);
                setBarcodeError('');
              }}
            />
          </div>
          {barcodeError
            ? <p className="text-xs text-red-500">{barcodeError}</p>
            : <p className="text-xs text-gray-400">Type the barcode printed on the packaging — the POS scanner uses this to find the product.</p>
          }
        </div>

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
          disabled={!canAdd}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add Product
        </button>
      </div>

      {/* Product list */}
      <div className="p-4 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-3 flex gap-3 items-center">
            <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded shrink-0" />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-black truncate">{p.name}</p>
              <p className="text-sm text-gray-600">{formatCurrencyFromSats(p.pricesats)}</p>
              <p className="text-xs text-gray-400">{p.stock ?? 0} in stock</p>
              <p className="text-[10px] font-mono text-gray-300 truncate">#{p.id}</p>
            </div>

            <button
              onClick={() => removeProduct(p.id)}
              className="text-red-500 text-sm shrink-0"
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
