const CART_KEY = 'cart'

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(item) {
  const items = getCart()
  const idx = items.findIndex((i) => i.id === item.id)
  if (idx >= 0) {
    items[idx].qty += item.qty
  } else {
    items.push(item)
  }
  setCart(items)
}

export function clearCart() {
  setCart([])
}

export function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0)
}

export function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.qty * i.pricePerKg, 0)
}
