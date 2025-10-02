export const getCartItemsCount = (): number => {
  if (typeof window !== 'undefined') {
    const count = localStorage.getItem('cartItemsCount');
    return count ? parseInt(count) : 0;
  }
  return 0;
};