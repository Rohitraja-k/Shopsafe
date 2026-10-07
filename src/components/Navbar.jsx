import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Bell,
  Search,
  Volume2,
  VolumeX,
  Database,
  Download,
  RotateCcw,
  Trash2,
  ChevronDown,
  Clock,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { isSoundEnabled, toggleSound, playSound } from '../services/sound';
import { exportProductsToJson } from '../services/storage';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenScanner,
  products = [],
  onResetSamples,
  onClearData,
  onViewProduct
}) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [alertsMenuOpen, setAlertsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const alertsRef = useRef(null);
  const profileRef = useRef(null);

  // Expiring items for quick notifications
  const urgentAlerts = products.filter((p) => {
    if (!p.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = p.expiryDate.split('-');
    const exp = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setAlertsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playSound('success');
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'inventory', label: 'Inventory' },
    {
      id: 'alerts',
      label: 'Alerts',
      badge: urgentAlerts.length > 0 ? urgentAlerts.length : null
    },
    { id: 'guide', label: 'Guide & Safety' }
  ];

  return (
    <header className="navbar-container glass-card">
      <div className="navbar-inner">
        {/* Brand */}
        <div
          className="brand-logo cursor-pointer"
          onClick={() => {
            setActiveTab('overview');
            playSound('click');
          }}
        >
          <div className="brand-icon-box">
            <ShieldCheck size={22} className="text-cyan animate-pulse-glow" />
          </div>
          <div className="brand-text-box">
            <span className="brand-title">ShopSafe</span>
            <span className="brand-tagline">Expiry Intelligence</span>
          </div>
        </div>

        {/* Center Nav Pills (Desktop) */}
        <nav className="nav-pills-bar hidden md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-pill-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                playSound('click');
              }}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge-count">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-right-actions">
          {/* Sound Toggle */}
          <button
            className="btn-icon-subtle"
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute Audio Effects' : 'Enable Audio Feedback'}
          >
            {soundOn ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} className="text-muted" />}
          </button>

          {/* Quick Notifications */}
          <div className="relative" ref={alertsRef}>
            <button
              className="btn-icon-subtle relative"
              onClick={() => setAlertsMenuOpen(!alertsMenuOpen)}
              title="Expiry Notifications"
            >
              <Bell size={18} />
              {urgentAlerts.length > 0 && (
                <span className="notification-dot" />
              )}
            </button>

            {alertsMenuOpen && (
              <div className="alerts-popover glass-card">
                <div className="popover-header">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Critical Expiry Alerts ({urgentAlerts.length})
                  </span>
                </div>
                <div className="popover-list">
                  {urgentAlerts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted">
                      <ShieldCheck size={24} className="text-emerald mx-auto mb-1" />
                      All products are within safe validity!
                    </div>
                  ) : (
                    urgentAlerts.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="popover-item"
                        onClick={() => {
                          onViewProduct(item);
                          setAlertsMenuOpen(false);
                        }}
                      >
                        <div className="popover-item-icon">
                          <AlertTriangle size={14} className="text-amber" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-2xs text-muted font-mono">
                            Expires: {item.expiryDate}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {urgentAlerts.length > 0 && (
                  <div className="popover-footer">
                    <button
                      className="btn-link-action w-full text-center"
                      onClick={() => {
                        setActiveTab('alerts');
                        setAlertsMenuOpen(false);
                      }}
                    >
                      View All Alerts →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile & Data menu */}
          <div className="relative" ref={profileRef}>
            <button
              className="user-profile-btn"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="avatar-circle">
                <span>AR</span>
              </div>
              <span className="hidden lg:inline text-xs font-medium text-slate-200">
                Alex R.
              </span>
              <ChevronDown size={14} className="text-muted" />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown-menu glass-card">
                <div className="dropdown-user-header">
                  <p className="text-xs font-bold text-white">Alex Roberts</p>
                  <p className="text-2xs text-cyan">Store Inventory Manager</p>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-menu-item"
                  onClick={() => {
                    exportProductsToJson();
                    setProfileMenuOpen(false);
                  }}
                >
                  <Download size={14} /> Export Backup (JSON)
                </button>
                <button
                  className="dropdown-menu-item"
                  onClick={() => {
                    onResetSamples();
                    setProfileMenuOpen(false);
                  }}
                >
                  <RotateCcw size={14} /> Reset Demo Products
                </button>
                <button
                  className="dropdown-menu-item text-crimson"
                  onClick={() => {
                    onClearData();
                    setProfileMenuOpen(false);
                  }}
                >
                  <Trash2 size={14} /> Clear All Records
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA: Add Product */}
          <button
            className="btn btn-primary btn-add-product"
            onClick={() => {
              onOpenAddModal();
              playSound('click');
            }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="btn-icon-subtle md:hidden ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
                playSound('click');
              }}
            >
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge-count">{item.badge}</span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
