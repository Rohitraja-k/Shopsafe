import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, ChevronDown, AlertTriangle } from 'lucide-react';
import { calculateExpiryStatus, formatDateDisplay } from '../utils/dateUtils';

export default function ProductTrackingTable({
  products = [],
  onViewProduct,
  onEditProduct,
  onDeleteProduct
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, safe, expiring-soon, expired
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const processedProducts = useMemo(() => {
    return products.map((item) => {
      const expiryMeta = calculateExpiryStatus(item.expiryDate);
      return {
        ...item,
        expiryMeta
      };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    return processedProducts.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.barcode && item.barcode.includes(searchTerm)) ||
        (item.id && String(item.id).toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchSearch) return false;

      if (statusFilter === 'ALL') return true;
      return item.expiryMeta.status === statusFilter;
    });
  }, [processedProducts, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'expired':
        return <span className="status-badge badge-red">Critical / Expired</span>;
      case 'expiring-soon':
        return <span className="status-badge badge-amber">Expiring Soon</span>;
      case 'safe':
      default:
        return <span className="status-badge badge-green">Valid</span>;
    }
  };

  return (
    <div className="tracking-table-card glass-card">
      <div className="table-header-row">
        <h3 className="card-title">Product Expiry Alert Tracking</h3>

        <div className="table-controls">
          {/* Live Search */}
          <div className="table-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search product, barcode, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="table-search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                ×
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              className={`filter-btn ${statusFilter !== 'ALL' ? 'filter-active' : ''}`}
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <Filter size={15} />
              <span>{statusFilter === 'ALL' ? 'Filter' : statusFilter.replace('-', ' ')}</span>
              <ChevronDown size={14} />
            </button>

            {filterMenuOpen && (
              <div className="filter-dropdown-menu">
                <button
                  className={`filter-dropdown-item ${statusFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('ALL');
                    setFilterMenuOpen(false);
                  }}
                >
                  All Statuses ({products.length})
                </button>
                <button
                  className={`filter-dropdown-item ${statusFilter === 'safe' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('safe');
                    setFilterMenuOpen(false);
                  }}
                >
                  <span className="dot dot-green"></span> Valid / Safe
                </button>
                <button
                  className={`filter-dropdown-item ${statusFilter === 'expiring-soon' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('expiring-soon');
                    setFilterMenuOpen(false);
                  }}
                >
                  <span className="dot dot-amber"></span> Expiring Soon (≤ 7 days)
                </button>
                <button
                  className={`filter-dropdown-item ${statusFilter === 'expired' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('expired');
                    setFilterMenuOpen(false);
                  }}
                >
                  <span className="dot dot-red"></span> Critical / Expired
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="table-responsive-wrapper">
        <table className="shopsafe-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty-row">
                  <div className="empty-state-mini">
                    <AlertTriangle size={24} className="text-muted mb-2" />
                    <p className="text-muted">No products found matching criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="table-data-row">
                  <td className="font-mono text-cyan text-xs">#{product.id}</td>
                  <td className="font-medium text-white">
                    <button
                      className="product-name-link text-left"
                      onClick={() => onViewProduct(product)}
                    >
                      {product.name}
                    </button>
                  </td>
                  <td>
                    <span className="category-tag">{product.category || 'General'}</span>
                  </td>
                  <td className="font-mono text-slate-300">
                    {product.stockLevel !== undefined ? product.stockLevel : 1}
                  </td>
                  <td className="text-sm">
                    <div className="flex flex-col">
                      <span className="font-mono text-slate-200">
                        {formatDateDisplay(product.expiryDate)}
                      </span>
                      <span className="text-xs text-muted">
                        {product.expiryMeta.label}
                      </span>
                    </div>
                  </td>
                  <td>{getStatusBadge(product.expiryMeta.status)}</td>
                  <td>
                    <div className="table-action-group">
                      <button
                        className="action-btn view-btn"
                        onClick={() => onViewProduct(product)}
                        title="View Details"
                      >
                        <Eye size={15} />
                        <span className="hidden sm:inline text-xs">View</span>
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEditProduct(product)}
                        title="Edit Product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDeleteProduct(product)}
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
