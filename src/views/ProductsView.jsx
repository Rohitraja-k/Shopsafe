import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  ArrowUpDown,
  Download,
  RotateCcw,
  PackageX,
  Sparkles,
  Layers,
  Camera
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductTrackingTable from '../components/ProductTrackingTable';
import { calculateExpiryStatus } from '../utils/dateUtils';
import { exportProductsToJson } from '../services/storage';

const CATEGORIES = [
  'ALL',
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

export default function ProductsView({
  products = [],
  initialFilter = 'all',
  onOpenAddModal,
  onOpenScanner,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onResetSamples
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter); // 'all', 'safe', 'expiring-soon', 'expired'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('expiry-asc'); // 'expiry-asc', 'expiry-desc', 'name-asc', 'date-added-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = products.map((item) => ({
      ...item,
      expiryMeta: calculateExpiryStatus(item.expiryDate)
    }));

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.expiryMeta.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter(
        (item) => item.category && item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.barcode && item.barcode.includes(q)) ||
          (item.id && String(item.id).toLowerCase().includes(q)) ||
          (item.storageLocation && item.storageLocation.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'expiry-asc') {
        return new Date(a.expiryDate || '9999-12-31') - new Date(b.expiryDate || '9999-12-31');
      } else if (sortBy === 'expiry-desc') {
        return new Date(b.expiryDate || '1970-01-01') - new Date(a.expiryDate || '1970-01-01');
      } else if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date-added-desc') {
        return new Date(b.dateAdded || '1970-01-01') - new Date(a.dateAdded || '1970-01-01');
      }
      return 0;
    });

    return result;
  }, [products, statusFilter, categoryFilter, searchTerm, sortBy]);

  // Counts for status tabs
  const counts = useMemo(() => {
    let safe = 0;
    let expiring = 0;
    let expired = 0;

    products.forEach((p) => {
      const { status } = calculateExpiryStatus(p.expiryDate);
      if (status === 'safe') safe++;
      else if (status === 'expiring-soon') expiring++;
      else if (status === 'expired') expired++;
    });

    return {
      all: products.length,
      safe,
      'expiring-soon': expiring,
      expired
    };
  }, [products]);

  return (
    <div className="products-view-container">
      {/* Header bar */}
      <div className="products-view-header">
        <div>
          <h1 className="dashboard-main-heading">Inventory & Product Catalog</h1>
          <p className="dashboard-subheading">
            Manage your complete repository of products, dates, and stock locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={exportProductsToJson}
            title="Download JSON data"
          >
            <Download size={15} /> Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className="inventory-toolbar glass-card">
        {/* Status Pill Tabs */}
        <div className="status-tabs-row">
          <button
            className={`status-filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Products <span className="tab-pill">{counts.all}</span>
          </button>
          <button
            className={`status-filter-tab tab-safe ${statusFilter === 'safe' ? 'active' : ''}`}
            onClick={() => setStatusFilter('safe')}
          >
            <span className="dot dot-green"></span> Valid & Safe{' '}
            <span className="tab-pill">{counts.safe}</span>
          </button>
          <button
            className={`status-filter-tab tab-amber ${statusFilter === 'expiring-soon' ? 'active' : ''}`}
            onClick={() => setStatusFilter('expiring-soon')}
          >
            <span className="dot dot-amber"></span> Expiring Soon{' '}
            <span className="tab-pill">{counts['expiring-soon']}</span>
          </button>
          <button
            className={`status-filter-tab tab-red ${statusFilter === 'expired' ? 'active' : ''}`}
            onClick={() => setStatusFilter('expired')}
          >
            <span className="dot dot-red"></span> Expired{' '}
            <span className="tab-pill">{counts.expired}</span>
          </button>
        </div>

        {/* Search, Categories, Sort, and View Toggle */}
        <div className="inventory-filters-row">
          {/* Search box */}
          <div className="toolbar-search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search product name, barcode, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="toolbar-search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                ×
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="toolbar-select-group">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="toolbar-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="toolbar-select-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="toolbar-select"
            >
              <option value="expiry-asc">Expiry: Soonest First</option>
              <option value="expiry-desc">Expiry: Latest First</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="date-added-desc">Recently Added</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredProducts.length === 0 ? (
        <div className="empty-inventory-card glass-card">
          <PackageX size={48} className="text-muted mb-3 animate-float" />
          <h3 className="text-lg font-bold text-white mb-1">No Products Found</h3>
          <p className="text-sm text-muted max-w-md text-center mb-4">
            {products.length === 0
              ? 'Your product inventory is currently empty. Add your first item or restore sample data to see the dashboard in action.'
              : 'No items match your active search and filter criteria. Try adjusting or clearing your filters.'}
          </p>

          <div className="flex gap-3">
            {products.length === 0 ? (
              <>
                <button className="btn btn-secondary" onClick={onResetSamples}>
                  <RotateCcw size={16} /> Restore Sample Data
                </button>
                <button className="btn btn-primary" onClick={onOpenAddModal}>
                  <Plus size={16} /> Add First Product
                </button>
              </>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('ALL');
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="products-card-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onViewProduct}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="products-table-wrapper">
          <ProductTrackingTable
            products={filteredProducts}
            onViewProduct={onViewProduct}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
        </div>
      )}
    </div>
  );
}
