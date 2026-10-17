/**
 * Product & Price Management Storage Utility
 * Manages product nominal prices, variants, custom pricing, and synchronization.
 */

import { Product, ProductVariant } from '../types';
import { PRODUCTS } from '../data/products';
import { pushSyncUpdate } from './syncManager';

export const STORAGE_KEY_PRODUCTS = 'reinstore_products_v1';
export const EVENT_PRODUCTS_UPDATED = 'reinstore_products_updated';

/**
 * Helper to recalculate minPrice, maxPrice, and priceRange string
 */
export function recalculateProductPricing(product: Product): Product {
  if (!product.variants || product.variants.length === 0) {
    return product;
  }
  const prices = product.variants.map((v) => Number(v.price) || 0).filter((p) => p > 0);
  if (prices.length === 0) return product;

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return {
    ...product,
    minPrice: min,
    maxPrice: max,
    priceRange: `Rp ${new Intl.NumberFormat('id-ID').format(min)} - Rp ${new Intl.NumberFormat('id-ID').format(max)}`,
  };
}

/**
 * Retrieve products with customized prices from localStorage or fallback to default
 */
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      return PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return PRODUCTS;
  } catch (err) {
    console.error('Failed to read products from storage:', err);
    return PRODUCTS;
  }
}

/**
 * Save products to localStorage, dispatch update event, and push cross-device sync
 */
export function saveStoredProducts(products: Product[]): void {
  try {
    const updated = products.map((p) => recalculateProductPricing(p));
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_PRODUCTS_UPDATED, { detail: updated }));
    pushSyncUpdate('products', updated);
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}

/**
 * Update a specific variant's price
 */
export function updateVariantPrice(productId: string, variantId: string, newPrice: number): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id !== productId) return p;
    const variants = p.variants.map((v) => (v.id === variantId ? { ...v, price: Number(newPrice) || 0 } : v));
    return recalculateProductPricing({ ...p, variants });
  });
  saveStoredProducts(updated);
  return updated;
}

/**
 * Update variant details (name, price, bonus, description)
 */
export function updateVariant(productId: string, variantId: string, updates: Partial<ProductVariant>): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id !== productId) return p;
    const variants = p.variants.map((v) => (v.id === variantId ? { ...v, ...updates } : v));
    return recalculateProductPricing({ ...p, variants });
  });
  saveStoredProducts(updated);
  return updated;
}

/**
 * Add a new variant to a product
 */
export function addVariant(productId: string, newVariant: Omit<ProductVariant, 'id'> & { id?: string }): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id !== productId) return p;
    const vId = newVariant.id || `var-${Date.now()}`;
    const variants = [...p.variants, { ...newVariant, id: vId }];
    return recalculateProductPricing({ ...p, variants });
  });
  saveStoredProducts(updated);
  return updated;
}

/**
 * Delete a variant from a product
 */
export function deleteVariant(productId: string, variantId: string): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id !== productId) return p;
    const variants = p.variants.filter((v) => v.id !== variantId);
    return recalculateProductPricing({ ...p, variants });
  });
  saveStoredProducts(updated);
  return updated;
}

/**
 * Bulk adjustment for all variants of a product (e.g., increase/decrease by percentage or fixed amount)
 */
export function bulkAdjustPrices(
  productId: string,
  type: 'fixed' | 'percent',
  amount: number
): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id !== productId) return p;
    const variants = p.variants.map((v) => {
      let nextPrice = v.price;
      if (type === 'percent') {
        nextPrice = Math.round(v.price * (1 + amount / 100));
      } else {
        nextPrice = v.price + amount;
      }
      return { ...v, price: Math.max(500, Math.round(nextPrice / 100) * 100) };
    });
    return recalculateProductPricing({ ...p, variants });
  });
  saveStoredProducts(updated);
  return updated;
}

/**
 * Add a completely new product to the catalog
 */
export function addProduct(newProduct: Product): Product[] {
  const current = getStoredProducts();
  // Ensure pricing is calculated
  const processed = recalculateProductPricing(newProduct);
  const updated = [processed, ...current];
  saveStoredProducts(updated);
  return updated;
}

/**
 * Delete a product completely from the store catalog
 */
export function deleteProduct(productId: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  saveStoredProducts(updated);
  return updated;
}

/**
 * Update product top-level information (name, logo, category, description, badge, etc.)
 */
export function updateProduct(productId: string, updates: Partial<Product>): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id !== productId) return p;
    const merged = { ...p, ...updates };
    return recalculateProductPricing(merged);
  });
  saveStoredProducts(updated);
  return updated;
}

/**
 * Reset all product prices to standard defaults
 */
export function resetStoredProducts(): Product[] {
  saveStoredProducts(PRODUCTS);
  return PRODUCTS;
}

