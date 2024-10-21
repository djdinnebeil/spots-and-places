// frontend/src/components/SpotDetailsPage/SpotDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetailsAndReviews, resetSpotDetails } from '../../store/spotDetails';
import './SpotDetailsPage.css';
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const { spot, reviews, hasReviewed, loading } = useSelector((state) => state.spotDetails);
  const userId = sessionUser?.id;
  const [dataLoaded, setDataLoaded] = useState(false); // State to track loading

  useEffect(() => {
    dispatch(fetchSpotDetailsAndReviews(spotId, userId))
      .then(() => setDataLoaded(true));

    return () => {
      dispatch(resetSpotDetails());
      setDataLoaded(false);
    };
  }, [dispatch, spotId, userId]);

  const refreshSpotDetails = () => {
    setDataLoaded(false);
    dispatch(fetchSpotDetailsAndReviews(spotId, userId))
      .then(() => setDataLoaded(true));
  };

  const previewImage = spot?.SpotImages?.find((img) => img.preview)?.url
    || 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/default-image-url.jpg';

  const otherImages = spot?.SpotImages?.filter((img) => !img.preview).slice(0, 4) || [];

  if (loading || !dataLoaded) return null;

  return (
    <div className="spot-details-container" data-testid={'spot-tile'}>
      <h1 data-testid={'spot-name'}>{spot.name}</h1>
      <div className="info-section" data-testid={'spot-location'}>
        <span className="spot-city-detail" data-testid={'spot-city'}>{spot.city}</span>, {spot.state}, {spot.country}
      </div>
      <div className="images-section">
        <div className="large-image">
          <img data-testid={'spot-large-image'} id="large-image-id" src={previewImage} alt={spot.name}/>
        </div>
        {otherImages.map((img, index) => (
          <div className="small-image-container" key={index}>
            <img data-testid={'spot-small-image'}
              id={`small-image-${index + 1}`}
              src={img.url}
              alt={`Additional image ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <div className='booking-section'>
        <div className='booking-description-section'>
          <h3 data-testid={'spot-host'}>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h3>
          <p data-testid={'spot-description'}>{spot.description}</p>
        </div>
        <div className="booking-box" data-testid={'spot-callout-box'}>
          <div className='price-and-review'>
            <div className="price-box" data-testid={'spot-price'}>${spot.price} night</div>
            <p className="review-box">
              <span data-testid={'spot-rating'} className="review-spot-rating">&#9733;{!isNaN(parseFloat(spot.avgStarRating)) ? parseFloat(spot.avgStarRating).toFixed(1) : 'New'}</span><span hidden={spot.avgStarRating === null}>&nbsp;·&nbsp;</span>
              <span data-testid={'review-count'} className="review-spot-total-reviews">{spot.numReviews === 1 && '1 Review' || spot.numReviews > 0 && `${spot.numReviews} Reviews`}</span>
            </p>
          </div>
          <button data-testid={'reserve-button'} className="reserve-button" onClick={() => alert('Feature coming soon')}>Reserve</button>
        </div>
      </div>
      <hr/>
      <div className="reviews-section">
        <h2 data-testid={'reviews-heading'}
            className="reviews-section-header"><span data-testid={'spot-rating'}>&#9733;{!isNaN(parseFloat(spot.avgStarRating)) ? parseFloat(spot.avgStarRating).toFixed(1) : 'New'}</span><span hidden={spot.avgStarRating === null}>&nbsp;·&nbsp;</span>
          <span data-testid={'review-count'}>{spot.numReviews === 1 && '1 Review' || spot.numReviews > 0 && `${spot.numReviews} Reviews`}</span></h2>

        <li className='post-review-button-spots-page' hidden={!sessionUser || sessionUser.id === spot.ownerId || hasReviewed}>
          <OpenModalButton
            dataTestId={'review-button'}
            hidden={!sessionUser || sessionUser.id === spot.ownerId || hasReviewed}
            buttonText="Post Your Review"
            buttonClassName='post-review-spot'
            // onButtonClick={closeMenu}  // Ensures the menu closes when clicked
            modalComponent={<PostReviewModal spotId={spotId} onReviewSubmit={refreshSpotDetails}/>}
          />
        </li>
        <hr/>
        <div className="review-list" data-testid={'review-list'}>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item" data-testid={'review-item'}>
                <div className="user-name-spot-page">{review.User?.firstName}</div>
              <div className="user-review-month" data-testid={'review-date'}>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              <p data-testid={'review-text'}>{review.review}</p>
              {sessionUser?.id === review.userId && (<OpenModalButton buttonClassName="delete-review-for-spot"
                buttonText="Delete"
                modalComponent={<DeleteReviewModal onReviewSubmit={refreshSpotDetails} reviewId={review.id} spotId={spotId} />}
              />)}
            </div>
          ))
        ) :  (
          <li>{sessionUser && sessionUser.id !== spot.ownerId && 'Be the first to post a review!' || 'No reviews yet'}</li>
        )}
      </div>
      </div>
    </div>
  );
};

export default SpotDetailsPage;
