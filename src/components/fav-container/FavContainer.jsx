import "./fav.css";

export const FavContainer = ({ favorites, removeFavorite, selectFavoriteCity }) => {
  return (
    <aside>
      <div className="heading">
        <p>Your Cities</p>
      </div>
      {favorites.length > 0 ? (
        <ul className="fav-list">
          {favorites.map((fav) => (
            <li 
              key={fav.id} 
              onClick={() => selectFavoriteCity(fav.name)}
            >
              <div className="fav-city-info">
                <span style={{fontWeight : '400'}}>{fav.name}</span>
                {fav.temp && fav.icon && (
                  <div className="fav-city-weather">
                    <img 
                      src={`https://openweathermap.org/img/wn/${fav.icon}@2x.png`} 
                      alt="Weather icon" 
                    />
                    <span>{fav.temp}°C</span>
                  </div>
                )}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-favorites">
          <p>No favorite cities yet. Add some to see them here!</p>
        </div>
      )}
    </aside>
  );
};