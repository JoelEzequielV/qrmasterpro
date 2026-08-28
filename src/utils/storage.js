const STORAGE_KEY = 'qr_history_v1';

export const getHistory = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveScanResult = (url) => {
  const history = getHistory();
  
  // Evitar duplicados inmediatos consecutivamente
  if (history.length > 0 && history[0].url === url) return history;

  const newItem = {
    id: Date.now().toString(),
    url,
    date: new Date().toLocaleDateString(),
    isFavorite: false
  };

  // Mantener máximo 10 elementos (conservando los favoritos aunque sean viejos)
  let updated = [newItem, ...history];
  
  const favorites = updated.filter(item => item.isFavorite);
  const nonFavorites = updated.filter(item => !item.isFavorite).slice(0, 10);
  
  updated = [...favorites, ...nonFavorites];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const toggleFavoriteStorage = (id) => {
  const history = getHistory();
  const updated = history.map(item => 
    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistoryStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  return [];
};