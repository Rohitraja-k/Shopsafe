import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Calendar,
  Layers,
  MapPin,
  Barcode as BarcodeIcon,
  Camera,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTodayDateString, addDaysToDateString } from '../utils/dateUtils';
import { playSound } from '../services/sound';
import BarcodeScannerModal from './BarcodeScannerModal';

const CATEGORIES = [
  'Groceries',
  'Medicines',
  'Cosmetics',
  'Packaged Food',
  'Household',
  'Dairy',
  'Beverages',
  'Bakery',
  'Other'
];

export default function AddEditProductModal({
  isOpen,
  onClose,
  onSave,
  editProduct = null
}) {
  const isEditing = !!editProduct;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Groceries',
    manufacturingDate: '',
    expiryDate: '',
    barcode: '',
    stockLevel: 1,
    storageLocation: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editProduct) {
        setFormData({
          name: editProduct.name || '',
          category: editProduct.category || 'Groceries',
          manufacturingDate: editProduct.manufacturingDate || '',
          expiryDate: editProduct.expiryDate || '',
          barcode: editProduct.barcode || '',
          stockLevel: editProduct.stockLevel || 1,
          storageLocation: editProduct.storageLocation || '',
          notes: editProduct.notes || ''
        });
      } else {
        const today = getTodayDateString();
        setFormData({
          name: '',
          category: 'Groceries',
          manufacturingDate: today,
          expiryDate: addDaysToDateString(today, 30),
          barcode: '',
          stockLevel: 1,
          storageLocation: '',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, editProduct]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Product name is required';
    }
    if (!formData.expiryDate) {
      errs.expiryDate = 'Expiry date is required';
    }
    if (
      formData.manufacturingDate &&
      formData.expiryDate &&
      new Date(formData.expiryDate) < new Date(formData.manufacturingDate)
    ) {
      errs.expiryDate = 'Expiry date cannot be earlier than manufacturing date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleGenerateBarcode = () => {
    playSound('click');
    const randomCode = '890' + Math.floor(1000000000 + Math.random() * 9000000000);
    setFormData((prev) => ({ ...prev, barcode: randomCode }));
  };

  const handleScanCapture = (code, meta = null) => {
    setFormData((prev) => ({
      ...prev,
      barcode: code,
      name: prev.name || (meta && meta.name ? meta.name : prev.name),
      category: prev.category === 'Groceries' && meta && meta.cat ? meta.cat : prev.category
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      playSound('warning');
      return;
    }

    playSound('success');

    if (!isEditing) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#10b981', '#6366f1']
        });
      } catch {
        // Confetti fallback
      }
    }

    const payload = {
      ...(editProduct ? editProduct : {}),
      ...formData,
      stockLevel: Number(formData.stockLevel) || 1
    };

    onSave(payload, isEditing);
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content glass-card form-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="flex items-center gap-2">
              <div className="icon-badge icon-badge-cyan">
                <Package size={20} />
              </div>
              <div>
                <h3 className="modal-title">
                  {isEditing ? 'Edit Product Details' : 'Add New Product'}
                </h3>
                <p className="modal-subtitle">
                  {isEditing
                    ? 'Update product information and recalculate expiry status'
                    : 'Register an item to monitor real-time shelf life & alerts'}
                </p>
              </div>
            </div>
            <button className="btn-icon" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            {/* Row 1: Name and Category */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Product Name <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Organic Almond Milk"
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  autoFocus
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Manufacturing Date and Expiry Date */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <Calendar size={13} className="text-muted" /> Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleChange}
                  className="form-input font-mono"
                />
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <Calendar size={13} className="text-amber" /> Expiry Date{' '}
                  <span className="text-crimson">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`form-input font-mono ${errors.expiryDate ? 'form-input-error' : ''}`}
                />
                {errors.expiryDate && (
                  <span className="form-error-msg">{errors.expiryDate}</span>
                )}
              </div>
            </div>

            {/* Row 3: Barcode with Scanner Trigger */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0 flex items-center gap-1">
                  <BarcodeIcon size={14} className="text-cyan" /> Barcode / QR Code
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={handleGenerateBarcode}
                  >
                    <Sparkles size={13} /> Auto-Generate
                  </button>
                  <button
                    type="button"
                    className="btn-link-action text-cyan"
                    onClick={() => setScannerOpen(true)}
                  >
                    <Camera size={13} /> Scan / Pick
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Scan or type UPC / EAN code (e.g. 8901234567890)"
                  className="form-input font-mono text-sm"
                />
                <button
                  type="button"
                  className="btn btn-secondary whitespace-nowrap"
                  onClick={() => setScannerOpen(true)}
                  title="Open Barcode Scanner"
                >
                  <Camera size={16} /> Scan
                </button>
              </div>
            </div>

            {/* Row 4: Stock Level & Storage Location */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <Layers size={13} className="text-muted" /> Stock Units / Quantity
                </label>
                <input
                  type="number"
                  name="stockLevel"
                  min="1"
                  max="9999"
                  value={formData.stockLevel}
                  onChange={handleChange}
                  className="form-input font-mono"
                />
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-1">
                  <MapPin size={13} className="text-muted" /> Storage Location
                </label>
                <input
                  type="text"
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleChange}
                  placeholder="e.g. Top Fridge Shelf, Pantry 1B"
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 5: Notes */}
            <div className="form-group">
              <label className="form-label">Notes & Storage Instructions</label>
              <textarea
                name="notes"
                rows="2"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Keep refrigerated below 5°C. Check seal before opening."
                className="form-textarea"
              />
            </div>

            {/* Actions */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} /> {isEditing ? 'Save Changes' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Barcode scanner sub-modal */}
      <BarcodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleScanCapture}
      />
    </>
  );
}
