import React from 'react';
import { Package, Bell, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCards({ stats, onFilterSelect }) {
  const { total, safe, expiringSoon, expired } = stats;

  const validPercent = total > 0 ? Math.round((safe / total) * 100) : 0;

  return (
    <div className="stats-grid">
      {/* Total Products Card */}
      <div 
        className="stat-card glass-card stat-total cursor-pointer"
        onClick={() => onFilterSelect && onFilterSelect('all')}
        title="Click to view all products"
      >
        <div className="stat-header">
          <span className="stat-title">Total Products</span>
          <div className="stat-icon-wrapper stat-icon-emerald">
            <Package size={20} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value">{total}</div>
          <div className="stat-trend trend-up">
            <TrendingUp size={14} />
            <span>Active Inventory</span>
          </div>
        </div>
      </div>

      {/* Alerts Pending / Expiring Soon Card */}
      <div 
        className="stat-card glass-card stat-alert cursor-pointer"
        onClick={() => onFilterSelect && onFilterSelect('expiring-soon')}
        title="Click to view expiring items"
      >
        <div className="stat-header">
          <span className="stat-title">Alerts Pending</span>
          <div className="stat-icon-wrapper stat-icon-amber">
            <Bell size={20} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value text-amber">{expiringSoon}</div>
          <div className="stat-trend trend-amber">
            <span>Expiring within 7 days</span>
          </div>
        </div>
      </div>

      {/* Expired Items Card */}
      <div 
        className="stat-card glass-card stat-critical cursor-pointer"
        onClick={() => onFilterSelect && onFilterSelect('expired')}
        title="Click to view expired items"
      >
        <div className="stat-header">
          <span className="stat-title">Expired Items</span>
          <div className="stat-icon-wrapper stat-icon-crimson">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value text-crimson">{expired}</div>
          <div className="stat-trend trend-down">
            <TrendingDown size={14} />
            <span>Requires Action</span>
          </div>
        </div>
      </div>

      {/* Valid Products Card */}
      <div 
        className="stat-card glass-card stat-safe cursor-pointer"
        onClick={() => onFilterSelect && onFilterSelect('safe')}
        title="Click to view safe products"
      >
        <div className="stat-header">
          <span className="stat-title">Safe Products</span>
          <div className="stat-icon-wrapper stat-icon-cyan">
            <ShieldCheck size={20} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value text-emerald">{safe}</div>
          <div className="stat-trend trend-up">
            <span>{validPercent}% Health Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
