// utils/adTracker.js
export const shouldShowPopupAd = () => {
  const lastShown = localStorage.getItem('lastPopupAd');
  if (!lastShown) return true;
  
  const hoursSinceLast = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
  // Only show once every 2 hours
  return hoursSinceLast >= 2;
};

export const recordPopupAdShown = () => {
  localStorage.setItem('lastPopupAd', Date.now().toString());
};