import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './views/DashboardView';
import ProductsView from './views/ProductsView';
import AlertsView from './views/AlertsView';
import AboutView from './views/AboutView';
import ProductModal from './components/ProductModal';
import AddEditProductModal from './components/AddEditProductModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import BarcodeScannerModal from './components/BarcodeScannerModal';
import Toast from './components/Toast';
import {
  loadProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  resetToSampleData,
  clearAllData
} from './services/storage';
import { playSound } from './services/sound';

export default function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'inventory', 'alerts', 'guide'
  const [inventoryInitialFilter, setInventoryInitialFilter] = useState('all');

  // Modals & Drawers
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message = '') => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev && prev.title === title ? null : prev));
    }, 4500);
  };

  // Initial load
  useEffect(() => {
    const loaded = loadProducts();
    setProducts(loaded);

    const handleStorageUpdate = () => {
      setProducts(loadProducts());
    };

    window.addEventListener('shopsafe_storage_update', handleStorageUpdate);
    return () => {
      window.removeEventListener('shopsafe_storage_update', handleStorageUpdate);
    };
  }, []);

  // Save (Create or Update) handler
  const handleSaveProduct = (productData, isEditing) => {
    if (isEditing) {
      const updated = updateProduct(productData);
      setProducts(loadProducts());
      showToast('success', 'Product Updated', `"${productData.name}" has been updated successfully.`);
      // If currently viewing the updated product, update view state as well
      if (viewingProduct && viewingProduct.id === productData.id) {
        setViewingProduct(updated);
      }
    } else {
      const created = addProduct(productData);
      setProducts(loadProducts());
      showToast('success', 'Product Saved', `"${productData.name}" was added to your inventory.`);
    }
  };

  // Delete handler
  const handleConfirmDelete = (productId) => {
    const deletedItem = products.find((p) => String(p.id) === String(productId));
    deleteProduct(productId);
    setProducts(loadProducts());
    setDeletingProduct(null);
    if (viewingProduct && String(viewingProduct.id) === String(productId)) {
      setViewingProduct(null);
    }
    showToast(
      'info',
      'Product Removed',
      deletedItem ? `"${deletedItem.name}" has been deleted.` : 'Product deleted.'
    );
  };

  // Reset to default samples
  const handleResetSamples = () => {
    const samples = resetToSampleData();
    setProducts(samples);
    playSound('success');
    showToast('success', 'Sample Data Restored', 'Standard demonstration products have been reloaded.');
  };

  // Clear all data
  const handleClearAll = () => {
    clearAllData();
    setProducts([]);
    playSound('delete');
    showToast('warning', 'Inventory Cleared', 'All stored product records have been removed.');
  };

  // Navigation helper with filter support
  const handleNavigateTab = (tab, filter = 'all') => {
    setInventoryInitialFilter(filter);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Barcode Scan from Navbar or Dashboard
  const handleGlobalScanSuccess = (code, meta = null) => {
    setIsScannerModalOpen(false);
    setEditingProduct({
      name: meta && meta.name ? meta.name : '',
      category: meta && meta.cat ? meta.cat : 'Groceries',
      barcode: code,
      stockLevel: 1
    });
    setIsAddEditOpen(true);
  };

  return (
    <div className="shopsafe-app-shell">
      {/* Background glow ambiance elements */}
      <div className="bg-glow-orb bg-glow-1"></div>
      <div className="bg-glow-orb bg-glow-2"></div>
      <div className="bg-glow-orb bg-glow-3"></div>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingProduct(null);
          setIsAddEditOpen(true);
        }}
        onOpenScanner={() => setIsScannerModalOpen(true)}
        products={products}
        onResetSamples={handleResetSamples}
        onClearData={handleClearAll}
        onViewProduct={(p) => setViewingProduct(p)}
      />

      {/* Main Content View Container */}
      <main className="main-content-container">
        {activeTab === 'overview' && (
          <DashboardView
            products={products}
            onOpenAddModal={() => {
              setEditingProduct(null);
              setIsAddEditOpen(true);
            }}
            onOpenScanner={() => setIsScannerModalOpen(true)}
            onViewProduct={(p) => setViewingProduct(p)}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsAddEditOpen(true);
            }}
            onDeleteProduct={(p) => setDeletingProduct(p)}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'inventory' && (
          <ProductsView
            products={products}
            initialFilter={inventoryInitialFilter}
            onOpenAddModal={() => {
              setEditingProduct(null);
              setIsAddEditOpen(true);
            }}
            onOpenScanner={() => setIsScannerModalOpen(true)}
            onViewProduct={(p) => setViewingProduct(p)}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsAddEditOpen(true);
            }}
            onDeleteProduct={(p) => setDeletingProduct(p)}
            onResetSamples={handleResetSamples}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsView
            products={products}
            onViewProduct={(p) => setViewingProduct(p)}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsAddEditOpen(true);
            }}
            onDeleteProduct={(p) => setDeletingProduct(p)}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'guide' && <AboutView onNavigateTab={handleNavigateTab} />}
      </main>

      {/* Modals */}
      {/* 1. Add / Edit Product Modal */}
      <AddEditProductModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editProduct={editingProduct}
      />

      {/* 2. Product Detail View Modal */}
      <ProductModal
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(p) => {
          setEditingProduct(p);
          setIsAddEditOpen(true);
        }}
        onDelete={(p) => setDeletingProduct(p)}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* 4. Global Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onScanSuccess={handleGlobalScanSuccess}
      />

      {/* 5. Animated Toast System */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="shopsafe-footer">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted">
          <span>
            <strong>ShopSafe</strong> – Product Management & Expiry Alert System
          </span>
          <span className="font-mono text-2xs text-slate-500">
            Offline Storage Engine • Key: shopsafeUserProducts
          </span>
        </div>
      </footer>
    </div>
  );
}
