import React from 'react';
import { Eye, Edit2, Trash2, Calendar, MapPin, Layers, Clock, AlertCircle } from 'lucide-react';
import { calculateExpiryStatus, formatDateDisplay, calculateLifecycleProgress } from '../utils/dateUtils';
import BarcodeRenderer from './BarcodeRenderer';

export default function ProductCard({ product, onView, onEdit, onDelete }) {
  const expiryMeta = calculateExpiryStatus(product.expiryDate);
  const progressPct = calculateLifecycleProgress(product.manufacturingDate, product.expiryDate);

  const getStatusBadge = () => {
    switch (expiryMeta.status) {
      case 'expired':
        return <span className="status-badge badge-red">Expired</span>;
      case 'expiring-soon':
        return <span className="status-badge badge-amber">Expiring Soon</span>;
      case 'safe':
      default:
        return <span className="status-badge badge-green">Valid</span>;
    }
  };

  const getProgressBarColor = () => {
    if (expiryMeta.status === 'expired') return 'bg-crimson';
    if (expiryMeta.status === 'expiring-soon') return 'bg-amber';
    return 'bg-emerald';
  };

  return (
    <div className={`product-card glass-card card-status-${expiryMeta.status}`}>
      {/* Top row */}
      <div className="card-top">
        <span className="category-tag">{product.category || 'General'}</span>
        {getStatusBadge()}
      </div>

      {/* Main product title */}
      <div className="card-main">
        <h4 className="product-title" onClick={() => onView(product)} title={product.name}>
          {product.name}
        </h4>
        <span className="product-id font-mono">#{product.id}</span>
      </div>

      {/* Expiry Banner */}
      <div className={`expiry-pill-box expiry-box-${expiryMeta.status}`}>
        <Clock size={14} className="shrink-0" />
        <span className="font-semibold text-xs">{expiryMeta.label}</span>
      </div>

      {/* Lifecycle progress bar */}
      <div className="lifecycle-bar-container">
        <div className="flex justify-between text-2xs text-muted mb-1 font-mono">
          <span>MFG: {formatDateDisplay(product.manufacturingDate)}</span>
          <span>EXP: {formatDateDisplay(product.expiryDate)}</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${getProgressBarColor()}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Barcode Snippet */}
      <div className="card-barcode-preview">
        {product.barcode ? (
          <BarcodeRenderer
            value={product.barcode}
            height={30}
            width={1.1}
            displayValue={false}
            lineColor="#475569"
          />
        ) : (
          <span className="text-xs text-muted">No Barcode</span>
        )}
      </div>

      {/* Meta details footer */}
      <div className="card-meta-row">
        {product.storageLocation && (
          <div className="flex items-center gap-1 truncate" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '60%' }}>
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{product.storageLocation}</span>
          </div>
        )}
        <div className="flex items-center gap-1 ml-auto font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <Layers size={11} />
          <span>Qty: {product.stockLevel || 1}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="card-actions-row">
        <button
          className="btn btn-secondary btn-sm flex-1"
          onClick={() => onView(product)}
        >
          <Eye size={14} /> View
        </button>
        <button
          className="btn-icon-soft"
          onClick={() => onEdit(product)}
          title="Edit Product"
        >
          <Edit2 size={14} />
        </button>
        <button
          className="btn-icon-soft text-crimson hover:bg-crimson/20"
          onClick={() => onDelete(product)}
          title="Delete Product"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
