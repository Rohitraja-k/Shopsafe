import React from 'react';
import { Camera, Plus, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import StatsCards from '../components/StatsCards';
import ExpiryChart from '../components/ExpiryChart';
import InventoryHealthChart from '../components/InventoryHealthChart';
import ProductTrackingTable from '../components/ProductTrackingTable';
import { calculateExpiryStatus } from '../utils/dateUtils';

export default function DashboardView({
  products = [],
  onOpenAddModal,
  onOpenScanner,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onNavigateTab
}) {
  // Compute dashboard statistics
  const stats = React.useMemo(() => {
    let safe = 0;
    let expiringSoon = 0;
    let expired = 0;

    products.forEach((item) => {
      const { status } = calculateExpiryStatus(item.expiryDate);
      if (status === 'safe') safe++;
      else if (status === 'expiring-soon') expiringSoon++;
      else if (status === 'expired') expired++;
    });

    return {
      total: products.length,
      safe,
      expiringSoon,
      expired
    };
  }, [products]);

  const handleFilterFromStat = (filterType) => {
    onNavigateTab('inventory', filterType);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Title Bar */}
      <div className="dashboard-hero-row">
        <div>
          <h1 className="dashboard-main-heading">ShopSafe Dashboard</h1>
          <p className="dashboard-subheading">
            Live telemetry for product freshness, shelf life, and critical expiry alerts.
          </p>
        </div>

        <div className="dashboard-quick-actions">
          <button
            className="btn btn-secondary"
            onClick={onOpenScanner}
            title="Scan physical barcode or test with presets"
          >
            <Camera size={16} className="text-cyan" />
            <span>Scan Product</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={onOpenAddModal}
            title="Add a new product entry"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Top Section: Stats Cards + Expiry Overview Donut Chart */}
      <div className="dashboard-top-grid">
        <div className="stats-col">
          <StatsCards stats={stats} onFilterSelect={handleFilterFromStat} />
        </div>
        <div className="chart-col">
          <ExpiryChart stats={stats} />
        </div>
      </div>

      {/* Bottom Section: Inventory Health Line Chart + Product Expiry Alert Tracking Table */}
      <div className="dashboard-bottom-grid">
        <div className="health-chart-col">
          <InventoryHealthChart products={products} />

          {/* Quick Smart Tip Card */}
          <div className="quick-tip-card glass-card mt-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-cyan" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Smart Shelf Tip
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Items approaching within <strong>7 days</strong> of expiry should be rotated to the front of the shelf or marked with high-visibility priority tags.
            </p>
          </div>
        </div>

        <div className="tracking-table-col">
          <ProductTrackingTable
            products={products}
            onViewProduct={onViewProduct}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
}
