/**
 * LocalStorage Service for ShopSafe
 * Key: 'shopsafeUserProducts'
 */

import { addDaysToDateString, getTodayDateString } from '../utils/dateUtils';

export const STORAGE_KEY = 'shopsafeUserProducts';

// Initial sample data tailored dynamically relative to today
export const getInitialSampleData = () => {
  const today = getTodayDateString();

  return [
    {
      id: 'SP-1001',
      name: 'Organic Whole Milk',
      category: 'Groceries',
      manufacturingDate: addDaysToDateString(today, -10),
      expiryDate: addDaysToDateString(today, 3), // Expiring Soon (in 3 days)
      barcode: '8901234567890',
      stockLevel: 145,
      storageLocation: 'Refrigerator (Shelf 2)',
      notes: 'Pasteurized homogenized milk. Keep chilled at 4°C.',
      dateAdded: addDaysToDateString(today, -5)
    },
    {
      id: 'SP-1002',
      name: 'Fresh Greek Yogurt',
      category: 'Groceries',
      manufacturingDate: addDaysToDateString(today, -14),
      expiryDate: addDaysToDateString(today, 5), // Expiring Soon (in 5 days)
      barcode: '8901122334455',
      stockLevel: 89,
      storageLocation: 'Refrigerator (Dairy Drawer)',
      notes: 'High protein plain greek yogurt.',
      dateAdded: addDaysToDateString(today, -6)
    },
    {
      id: 'SP-1003',
      name: 'Whole Wheat Artisan Bread',
      category: 'Packaged Food',
      manufacturingDate: addDaysToDateString(today, -6),
      expiryDate: addDaysToDateString(today, -1), // Expired (1 day ago)
      barcode: '8909876543210',
      stockLevel: 22,
      storageLocation: 'Pantry Breadbox',
      notes: 'No preservatives. Check for any mold.',
      dateAdded: addDaysToDateString(today, -4)
    },
    {
      id: 'SP-1004',
      name: 'Baby Nutrient Formula 400g',
      category: 'Medicines',
      manufacturingDate: addDaysToDateString(today, -60),
      expiryDate: addDaysToDateString(today, 120), // Safe
      barcode: '8904433221100',
      stockLevel: 67,
      storageLocation: 'Medicine Cabinet',
      notes: 'Fortified with iron & DHA.',
      dateAdded: addDaysToDateString(today, -20)
    },
    {
      id: 'SP-1005',
      name: 'Organic Baby Spinach Greens',
      category: 'Groceries',
      manufacturingDate: addDaysToDateString(today, -5),
      expiryDate: addDaysToDateString(today, -2), // Expired (2 days ago)
      barcode: '8907766554433',
      stockLevel: 15,
      storageLocation: 'Crisper Drawer',
      notes: 'Pre-washed baby spinach leaves.',
      dateAdded: addDaysToDateString(today, -5)
    },
    {
      id: 'SP-1006',
      name: 'Vitamin C 1000mg Effervescent',
      category: 'Medicines',
      manufacturingDate: addDaysToDateString(today, -90),
      expiryDate: addDaysToDateString(today, 240), // Safe
      barcode: '8905544332211',
      stockLevel: 110,
      storageLocation: 'Medicine Cabinet',
      notes: 'Immunity booster tablets. Store in cool, dry place.',
      dateAdded: addDaysToDateString(today, -30)
    },
    {
      id: 'SP-1007',
      name: 'Hydrating Hyaluronic Face Serum',
      category: 'Cosmetics',
      manufacturingDate: addDaysToDateString(today, -40),
      expiryDate: addDaysToDateString(today, 180), // Safe
      barcode: '8906655443322',
      stockLevel: 34,
      storageLocation: 'Vanity Counter',
      notes: 'Dermatologically tested gentle formula.',
      dateAdded: addDaysToDateString(today, -15)
    },
    {
      id: 'SP-1008',
      name: 'Eco Dishwashing Liquid 750ml',
      category: 'Household',
      manufacturingDate: addDaysToDateString(today, -120),
      expiryDate: addDaysToDateString(today, 365), // Safe
      barcode: '8908877665544',
      stockLevel: 95,
      storageLocation: 'Under Sink Shelf',
      notes: 'Plant-based citrus clean formula.',
      dateAdded: addDaysToDateString(today, -45)
    }
  ];
};

/**
 * Load products from LocalStorage, or initialize with sample data if completely empty.
 */
export const loadProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load products from LocalStorage:', err);
    return [];
  }
};

/**
 * Save full array of products to LocalStorage
 */
export const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    // Trigger custom event so any listeners update in real time
    window.dispatchEvent(new Event('shopsafe_storage_update'));
    return true;
  } catch (err) {
    console.error('Failed to save products to LocalStorage:', err);
    return false;
  }
};

/**
 * Add a new product
 */
export const addProduct = (productData) => {
  const products = loadProducts();
  const newProduct = {
    ...productData,
    id: productData.id || `SP-${Math.floor(1000 + Math.random() * 9000)}`,
    dateAdded: productData.dateAdded || getTodayDateString(),
    stockLevel: Number(productData.stockLevel) || 1
  };
  const updated = [newProduct, ...products];
  saveProducts(updated);
  return newProduct;
};

/**
 * Update an existing product
 */
export const updateProduct = (updatedProduct) => {
  const products = loadProducts();
  const index = products.findIndex((p) => String(p.id) === String(updatedProduct.id));
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updatedProduct,
      stockLevel: Number(updatedProduct.stockLevel) || 1
    };
    saveProducts(products);
    return products[index];
  }
  return null;
};

/**
 * Delete a product by ID
 */
export const deleteProduct = (productId) => {
  const products = loadProducts();
  const filtered = products.filter((p) => String(p.id) !== String(productId));
  saveProducts(filtered);
  return filtered;
};

/**
 * Reset data back to default initial samples
 */
export const resetToSampleData = () => {
  const samples = getInitialSampleData();
  saveProducts(samples);
  return samples;
};

/**
 * Clear all data completely
 */
export const clearAllData = () => {
  saveProducts([]);
  return [];
};

/**
 * Export products to JSON file download
 */
export const exportProductsToJson = () => {
  const products = loadProducts();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `ShopSafe_Backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
