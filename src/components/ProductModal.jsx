import React from 'react';
import {
  X,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Printer,
  Edit2,
  Trash2,
  Tag,
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { calculateExpiryStatus, formatDateDisplay, calculateLifecycleProgress } from '../utils/dateUtils';
import BarcodeRenderer from './BarcodeRenderer';

export default function ProductModal({ product, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !product) return null;

  const expiryMeta = calculateExpiryStatus(product.expiryDate);
  const progressPct = calculateLifecycleProgress(product.manufacturingDate, product.expiryDate);

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card product-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <span className="category-tag">{product.category || 'General'}</span>
            <span className="product-id font-mono">#{product.id}</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Product Title */}
        <div className="product-modal-hero">
          <h2 className="product-modal-title">{product.name}</h2>
          <p className="product-modal-added text-xs text-muted">
            Added to inventory on {formatDateDisplay(product.dateAdded)}
          </p>
        </div>

        {/* Expiry Hero Highlight Box */}
        <div className={`expiry-highlight-box highlight-${expiryMeta.status}`}>
          <div className="flex items-center gap-3">
            {expiryMeta.status === 'expired' ? (
              <AlertTriangle size={32} className="text-crimson shrink-0 animate-pulse" />
            ) : expiryMeta.status === 'expiring-soon' ? (
              <Clock size={32} className="text-amber shrink-0" />
            ) : (
              <CheckCircle2 size={32} className="text-emerald shrink-0" />
            )}
            <div>
              <span className="expiry-highlight-title">{expiryMeta.label}</span>
              <p className="expiry-highlight-sub">
                {expiryMeta.status === 'expired'
                  ? 'This item has exceeded its recommended safety date.'
                  : expiryMeta.status === 'expiring-soon'
                  ? 'Urgent: Consume or rotate stock before expiry date.'
                  : 'Safe for consumption/usage under proper storage.'}
              </p>
            </div>
          </div>
          <div className="expiry-countdown-pill font-mono">
            {expiryMeta.daysLeft < 0
              ? `${Math.abs(expiryMeta.daysLeft)}d Overdue`
              : `${expiryMeta.daysLeft} Days Left`}
          </div>
        </div>

        {/* Lifecycle progress bar */}
        <div className="lifecycle-section glass-inset p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center text-xs text-muted mb-1">
            <span>Freshness Timeline</span>
            <span className="font-mono text-cyan">{progressPct}% Elapsed</span>
          </div>
          <div className="progress-track mb-2">
            <div
              className={`progress-fill ${
                expiryMeta.status === 'expired'
                  ? 'bg-crimson'
                  : expiryMeta.status === 'expiring-soon'
                  ? 'bg-amber'
                  : 'bg-emerald'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-2xs text-muted font-mono">
            <span>MFG: {formatDateDisplay(product.manufacturingDate)}</span>
            <span>EXP: {formatDateDisplay(product.expiryDate)}</span>
          </div>
        </div>

        {/* Barcode Display Box */}
        <div className="modal-barcode-box glass-inset">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xs text-muted tracking-wider uppercase font-semibold">
              Barcode / SKU Identification
            </span>
            <span className="text-2xs text-cyan font-mono">{product.barcode || 'N/A'}</span>
          </div>
        {product.barcode ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 8px', backgroundColor: 'rgba(5,8,20,0.7)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <BarcodeRenderer
                value={product.barcode}
                height={52}
                width={1.6}
                displayValue={true}
                lineColor="#94a3b8"
                fontSize={10}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', color: '#64748b', fontSize: '0.8rem' }}>No Barcode Assigned</div>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="specs-grid">
          <div className="spec-card">
            <Tag size={15} className="text-cyan mb-1" />
            <span className="spec-label">Category</span>
            <span className="spec-value">{product.category || 'N/A'}</span>
          </div>
          <div className="spec-card">
            <Calendar size={15} className="text-indigo-400 mb-1" />
            <span className="spec-label">Manufacturing Date</span>
            <span className="spec-value font-mono">{formatDateDisplay(product.manufacturingDate)}</span>
          </div>
          <div className="spec-card">
            <Clock size={15} className="text-amber mb-1" />
            <span className="spec-label">Expiry Date</span>
            <span className="spec-value font-mono">{formatDateDisplay(product.expiryDate)}</span>
          </div>
          <div className="spec-card">
            <Layers size={15} className="text-emerald mb-1" />
            <span className="spec-label">Stock Units</span>
            <span className="spec-value font-mono">{product.stockLevel || 1}</span>
          </div>
          {product.storageLocation && (
            <div className="spec-card col-span-2">
              <MapPin size={15} className="text-purple-400 mb-1" />
              <span className="spec-label">Storage Location</span>
              <span className="spec-value">{product.storageLocation}</span>
            </div>
          )}
        </div>

        {/* Notes section if present */}
        {product.notes && (
          <div className="notes-box glass-inset mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
              <FileText size={13} />
              <span>Notes & Storage Instructions</span>
            </div>
            <p className="text-xs text-slate-300">{product.notes}</p>
          </div>
        )}

        {/* Actions Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={handlePrintLabel} title="Print Product Label">
            <Printer size={15} /> Print Badge
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
            >
              <Edit2 size={15} /> Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                onClose();
                onDelete(product);
              }}
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
