import React from 'react';
import { Star, Share2, Copy, Trash2 } from 'lucide-react';

export const HistoryList = ({ items, onToggleFavorite, onClear }) => {

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL copiada al portapapeles');
  };

  const handleShare = async (url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'URL Escaneada',
          url: url,
        });
      } catch (err) {
        console.log('Error al compartir', err);
      }
    } else {
      // Fallback a WhatsApp si Web Share API no está disponible
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (items.length === 0) {
    return <p className="empty-msg">No hay códigos escaneados aún.</p>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Historial (Últimos 10 / Favoritos)</h3>
        <button className="clear-btn" onClick={onClear}>
          <Trash2 size={16} />
        </button>
      </div>

      <ul className="history-list">
        {items.map((item) => (
          <li key={item.id} className={`history-item ${item.isFavorite ? 'favorite' : ''}`}>
            <div className="item-main">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="qr-link">
                {item.url}
              </a>
              <span className="item-date">{item.date}</span>
            </div>

            <div className="item-actions">
              <button onClick={() => onToggleFavorite(item.id)} className="action-btn">
                <Star size={18} fill={item.isFavorite ? "#f59e0b" : "none"} color={item.isFavorite ? "#f59e0b" : "#666"} />
              </button>
              <button onClick={() => handleCopy(item.url)} className="action-btn">
                <Copy size={18} />
              </button>
              <button onClick={() => handleShare(item.url)} className="action-btn">
                <Share2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};