// frontend/src/components/CurrentUserSpots/CurrentUserSpots.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUserSpots } from '../../store/spots';
import './CurrentUserSpots.css';
import {Link, useNavigate, useLocation} from "react-router-dom";
import OpenModalButton from '../OpenModalButton';
import ConfirmDeleteModal from '../ConfirmDeleteModal';

const CurrentUserSpots = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const currentUserSpots = useSelector((state) => state.spots.currentUserSpots);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCurrentUserSpots());
  }, [dispatch]);

  // Fetch current user's spots when user logs in or route changes to `/spots/current`.
  useEffect(() => {
    if (currentUser && location.pathname === '/spots/current') {
      dispatch(fetchCurrentUserSpots());
    }
  }, [currentUser, location, dispatch]);

  const handleRefresh = () => {
    if (location.pathname === '/spots/new') {
      navigate(0);
    }
  }

  const handleDeleteRefresh = () => {
    dispatch(fetchCurrentUserSpots()); // Refresh spots without extra state management
  };

  const handleUpdateClick = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  }

  if (!currentUser) return null;

  return (
    <>
      <h2 className='manage-spots-header'>Manage Spots</h2>
      <button className='manage-spots-create-new-spot' data-testid={'user-spots'}>
        <Link className='manage-spots-create-new-spot-link' to='/spots/new' onClick={handleRefresh}>
          Create a New Spot
        </Link>
      </button>
      {currentUserSpots.length > 0 && (
      <div className="spotsContainer">
        <ul className="spotsList">
          {currentUserSpots.map((spot) => (
            <div key={spot.id} data-testid={'spot-tile'} className='spots-tile-with-options'>
              <li key={spot.id} className="spotTile" title={spot.name}>
                <Link
                  className={"spot-link-to-spot-page"}
                  to={`/spots/${spot.id}`}
                  data-testid={'spot-link'}
                >
                <img
                  data-testid={'spot-thumbnail-image'}
                  src={spot.previewImage || 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/default-image-url.jpg'}
                  alt={spot.name}/>
                <div className="spotInfo" data-testid={'spot-city'}>
                  <span >{spot.city}, {spot.state}</span>
                  <span className="rating" data-testid={'spot-rating'}>&#9733; {!isNaN(parseFloat(spot.avgRating))
                    ? parseFloat(spot.avgRating).toFixed(1)
                    : 'New'}</span>
                </div>
                <span className="price" data-testid={'spot-price'}>${spot.price} night</span>
                </Link>
              </li>
              <div className='update-and-delete-row'>
                <button className='manage-spots-update-button' onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateClick(spot.id)
                }}
                >Update
                </button>
                <div className='stop-delete-propagation' onClick={(e) => e.stopPropagation()}>
                  <OpenModalButton
                    buttonText="Delete"
                    buttonClassName="manage-spots-delete-button"
                    modalComponent={<ConfirmDeleteModal spotId={spot.id} handleDeleteRefresh={handleDeleteRefresh}/>}
                  />
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
        )}
    </>
  );
};

export default CurrentUserSpots;
