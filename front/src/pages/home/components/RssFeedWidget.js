// components/RssFeedWidget/RssFeedWidget.jsx
import React, { useState, useEffect } from 'react';
import styles from './RssFeedWidget.module.css';

// Fonction utilitaire pour extraire l'URL de la première image d'une chaîne HTML
function extractFirstImageSrc(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  return match ? match[1] : null;
}

// Nettoie la description en supprimant les balises <img> et <br>
function cleanDescription(html) {
  if (!html) return '';
  // Supprime toutes les balises <img ...>
  let cleaned = html.replace(/<img[^>]*>/gi, '');
  // Supprime les <br> (simples ou multiples)
  cleaned = cleaned.replace(/(<br\s*\/?>)+/gi, '');
  return cleaned.trim();
}

function RssFeedWidget({ rssFeedUrl }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const MAX_ITEMS_VISIBLE_INITIALLY = 5;

  useEffect(() => {
    if (!rssFeedUrl) {
      setError(new Error("Aucune URL de flux RSS n'a été fournie."));
      setLoading(false);
      return;
    }
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;
    setLoading(true);
    setError(null);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          return response.json().catch(() => null).then(errorData => {
             throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}. ${errorData?.message || ''}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (!data || data.status !== 'ok' || !data.items || !Array.isArray(data.items)) {
          throw new Error(`Réponse invalide de l'API rss2json: ${data?.status} - ${data?.message || 'Format inconnu.'}`);
        }
        setItems(data.items);
      })
      .catch(err => {
        console.error("Erreur lors du chargement du flux RSS:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rssFeedUrl]);

  const itemsToShow = showAll ? items : items.slice(0, MAX_ITEMS_VISIBLE_INITIALLY);
  const canShowMore = items.length > MAX_ITEMS_VISIBLE_INITIALLY;
  const toggleButtonText = showAll
    ? 'Afficher moins'
    : `Afficher ${items.length - MAX_ITEMS_VISIBLE_INITIALLY} article(s) de plus`;

  const handleToggleClick = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={styles.widgetFrame}>
      <h2 className={styles.widgetTitle}>Actualités du Flux</h2>

      {loading && <p className={styles.loadingMessage}>Chargement du flux...</p>}
      {error && <p className={styles.errorMessage}>Impossible de charger le flux RSS. ({error.message})</p>}

      {!loading && !error && items.length > 0 && (
        <div className={styles.itemList}>
          {itemsToShow.map((item, index) => {
            // Détermination de l'image à afficher
            const imageUrl = item.thumbnail || extractFirstImageSrc(item.description);
            return (
              <div className={styles.listItem} key={item.guid || item.link || `item-${index}`}> 
                {/* Affiche l'image si trouvée */}                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={`${item.title || 'Article RSS'}`}
                    className={styles.itemImage}
                    loading="lazy"
                    style={{ maxWidth: '100%', maxHeight: '320px', width: 'auto', height: 'auto', display: 'block', margin: '0 auto' }}
                  />
                )}
                <h3 className={styles.itemTitle}>
                  <a className={styles.itemLink} href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title || 'Titre manquant'}
                  </a>
                </h3>
                <p className={styles.itemDescription}>
                  {cleanDescription(item.description) || ''}
                </p>
                <span className={styles.itemDate}>
                  {formatDate(item.pubDate)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
            <p className={styles.message}>Aucun article trouvé dans le flux.</p>
       )}

      {!loading && !error && canShowMore && (
        <button className={styles.toggleButton} onClick={handleToggleClick}>
          {toggleButtonText}
        </button>
      )}
    </div>
  );
}

export default RssFeedWidget;