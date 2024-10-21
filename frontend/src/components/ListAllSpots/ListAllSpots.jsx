// frontend/src/components/ListAllSpots/ListAllSpots.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { Link } from 'react-router-dom';
import './ListAllSpots.css';

const SpotsList = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="spotsContainer">
      <ul className="spotsList" data-testid={'spots-list'}>
        {spots.map((spot) => (
          <li key={spot.id} className="spotTile" data-testid={'spot-tile'}>
            <Link
                  className='spot-link-to-spot-page'
                  to={`/spots/${spot.id}`}
                  data-testid='spot-link'
            >
              <div className="spot-title-div"
                   data-testid={'spot-tooltip'}
                   title={spot.name}
              >
                <img
                  data-testid={'spot-thumbnail-image'}
                     src={
                       spot.previewImage ||
                       'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/default-image-url.jpg'
                     }
                     alt={`${spot.name} preview`}
                />
                <div className="spotInfo">
                  <div className="location" data-testid={'spot-city'}>
                    {spot.city}, {spot.state}
                  </div>
                  <div className="rating-plus-star">&#9733;
                  <span className="rating" data-testid={'spot-rating'}>
                    {!isNaN(parseFloat(spot.avgRating))
                      ? parseFloat(spot.avgRating).toFixed(1)
                      : 'New'}
                  </span>
                  </div>
                </div>
                <div className="price" data-testid={'spot-price'}>${spot.price} night</div>
              </div>
            </Link>
          </li>
          ))}
      </ul>
    </div>
  );
};

export default SpotsList;
