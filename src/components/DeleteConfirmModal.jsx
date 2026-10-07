import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { playSound } from '../services/sound';

export default function DeleteConfirmModal({ product, isOpen, onClose, onConfirm }) {
  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    playSound('delete');
    onConfirm(product.id);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon-wrapper">
          <div className="delete-modal-icon">
            <AlertTriangle size={32} className="text-crimson" />
          </div>
        </div>

        <h3 className="delete-modal-title">Delete this product?</h3>
        <p className="delete-modal-desc">
          Are you sure you want to delete <strong className="text-white">"{product.name}"</strong> (ID: #{product.id})? This action will remove the product and recalculate all alerts.
        </p>

        <div className="delete-modal-actions">
          <button className="btn btn-secondary flex-1" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger flex-1" onClick={handleConfirm}>
            <Trash2 size={16} /> Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
