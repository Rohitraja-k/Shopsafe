import React from 'react';
import { AlertTriangle, Clock, ShieldCheck, CheckCircle, Trash2, Edit2, Eye, Bell } from 'lucide-react';
import { calculateExpiryStatus, formatDateDisplay } from '../utils/dateUtils';
import BarcodeRenderer from '../components/BarcodeRenderer';

export default function AlertsView({
  products = [],
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onNavigateTab
}) {
  // Extract all expired and expiring soon products
  const alertItems = React.useMemo(() => {
    return products
      .map((item) => ({
        ...item,
        expiryMeta: calculateExpiryStatus(item.expiryDate)
      }))
      .filter((item) => item.expiryMeta.status === 'expired' || item.expiryMeta.status === 'expiring-soon')
      .sort((a, b) => {
        // Sort expired first, then ascending by days left
        if (a.expiryMeta.status === 'expired' && b.expiryMeta.status !== 'expired') return -1;
        if (a.expiryMeta.status !== 'expired' && b.expiryMeta.status === 'expired') return 1;
        return a.expiryMeta.daysLeft - b.expiryMeta.daysLeft;
      });
  }, [products]);

  const expiredCount = alertItems.filter((i) => i.expiryMeta.status === 'expired').length;
  const expiringCount = alertItems.filter((i) => i.expiryMeta.status === 'expiring-soon').length;

  return (
    <div className="alerts-view-container">
      {/* Title */}
      <div className="alerts-header-row mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="icon-badge icon-badge-amber">
              <Bell size={20} />
            </div>
            <h1 className="dashboard-main-heading mb-0">Critical Expiry Alerts & Actions</h1>
          </div>
          <p className="dashboard-subheading">
            Products requiring immediate attention, rotation, usage, or safe disposal.
          </p>
        </div>

        {/* Counter badges */}
        <div className="flex items-center gap-2">
          <span className="stat-pill-badge badge-red">
            <AlertTriangle size={14} /> {expiredCount} Expired
          </span>
          <span className="stat-pill-badge badge-amber">
            <Clock size={14} /> {expiringCount} Expiring Soon
          </span>
        </div>
      </div>

      {alertItems.length === 0 ? (
        <div className="empty-alerts-card glass-card text-center p-8">
          <ShieldCheck size={54} className="text-emerald mx-auto mb-3 animate-pulse-glow" />
          <h3 className="text-xl font-bold text-white mb-1">Inventory is 100% Healthy!</h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-4">
            No items are expired or approaching expiry in the next 7 days. All products have ample shelf life remaining.
          </p>
          <button
            className="btn btn-secondary mx-auto"
            onClick={() => onNavigateTab('inventory')}
          >
            Explore Complete Inventory →
          </button>
        </div>
      ) : (
        <div className="alerts-list-grid">
          {alertItems.map((item) => (
            <div
              key={item.id}
              className={`alert-item-card glass-card border-l-4 ${
                item.expiryMeta.status === 'expired'
                  ? 'border-l-crimson alert-expired-card'
                  : 'border-l-amber alert-soon-card'
              }`}
            >
              <div className="alert-card-header">
                <div className="flex items-center gap-2">
                  <span className="category-tag">{item.category}</span>
                  <span className="text-2xs font-mono text-cyan">#{item.id}</span>
                </div>
                <span
                  className={`status-badge ${
                    item.expiryMeta.status === 'expired' ? 'badge-red' : 'badge-amber'
                  }`}
                >
                  {item.expiryMeta.badgeText}
                </span>
              </div>

              <div className="alert-card-body my-3">
                <h3
                  className="alert-product-title cursor-pointer hover:text-cyan transition-colors"
                  onClick={() => onViewProduct(item)}
                >
                  {item.name}
                </h3>

                <div className="alert-urgency-banner">
                  {item.expiryMeta.status === 'expired' ? (
                    <div className="flex items-center gap-1.5 text-crimson text-xs font-semibold">
                      <AlertTriangle size={14} />
                      <span>{item.expiryMeta.label}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber text-xs font-semibold">
                      <Clock size={14} />
                      <span>{item.expiryMeta.label}</span>
                    </div>
                  )}
                  <span className="text-2xs text-muted font-mono ml-auto">
                    EXP: {formatDateDisplay(item.expiryDate)}
                  </span>
                </div>

                <div className="alert-details-grid mt-2">
                  <div className="alert-detail-row">
                    <span className="alert-detail-label">Location</span>
                    <span className="alert-detail-value">{item.storageLocation || 'General Shelf'}</span>
                  </div>
                  <div className="alert-detail-row">
                    <span className="alert-detail-label">Stock Units</span>
                    <span className="alert-detail-value font-mono">{item.stockLevel || 1}</span>
                  </div>
                  {item.barcode && (
                    <div className="alert-detail-row">
                      <span className="alert-detail-label">Barcode</span>
                      <span className="alert-detail-value font-mono">{item.barcode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Action Checklist */}
              <div className="alert-action-tips glass-inset p-2 rounded mb-3 text-2xs">
                <span className="font-semibold text-white block mb-0.5">Recommended Action:</span>
                <p className="text-slate-300">
                  {item.expiryMeta.status === 'expired'
                    ? 'Safe discard recommended. Inspect for signs of spoilage or degradation.'
                    : 'Prioritize consumption, display on front shelf, or apply discount alert.'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="alert-card-actions flex gap-2">
                <button
                  className="btn btn-secondary btn-sm flex-1"
                  onClick={() => onViewProduct(item)}
                >
                  <Eye size={13} /> View
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEditProduct(item)}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDeleteProduct(item)}
                  title="Remove from inventory"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
