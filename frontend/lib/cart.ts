import { Product } from "./types"

export interface CartItem {
  product: Product
  quantity: number
}

export function getCart(): CartItem[] {
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export function addToCart(product: Product, quantity: number = 1) {
  const cart = getCart()
  const existingItem = cart.find(item => item.product.id === product.id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ product, quantity })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  // Dispatch event for cart update
  window.dispatchEvent(new Event('cartUpdate'))
  return cart
}

export function removeFromCart(productId: number) {
  const cart = getCart()
  const updatedCart = cart.filter(item => item.product.id !== productId)
  localStorage.setItem('cart', JSON.stringify(updatedCart))
  // Dispatch event for cart update
  window.dispatchEvent(new Event('cartUpdate'))
  return updatedCart
}

export function updateCartItemQuantity(productId: number, quantity: number) {
  const cart = getCart()
  const item = cart.find(item => item.product.id === productId)
  
  if (item) {
    item.quantity = quantity
    localStorage.setItem('cart', JSON.stringify(cart))
    // Dispatch event for cart update
    window.dispatchEvent(new Event('cartUpdate'))
  }
  
  return cart
}

export function clearCart() {
  localStorage.removeItem('cart')
  // Dispatch event for cart update
  window.dispatchEvent(new Event('cartUpdate'))
  return []
}

export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
}

export function getCartItemsCount(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

export function getCartUniqueItemsCount(): number {
  const cart = getCart()
  return cart.length
} 