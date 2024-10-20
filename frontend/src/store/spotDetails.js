// frontend/src/store/spotDetails.js
import { csrfFetch } from './csrf';

const SET_SPOT_DETAILS = 'spotDetails/SET_SPOT_DETAILS';
const SET_REVIEWS = 'spotDetails/SET_REVIEWS';
const SET_USER_REVIEW_STATUS = 'spotDetails/SET_USER_REVIEW_STATUS';
const START_LOADING = 'spotDetails/START_LOADING';
const RESET_SPOT_DETAILS = 'spotDetails/RESET_SPOT_DETAILS';

export const resetSpotDetails = () => ({
  type: RESET_SPOT_DETAILS,
});

const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  payload: spot,
});

const setReviews = (reviews) => ({
  type: SET_REVIEWS,
  payload: reviews,
});

const setUserReviewStatus = (hasReviewed) => ({
  type: SET_USER_REVIEW_STATUS,
  payload: hasReviewed,
});

const startLoading = () => ({
  type: START_LOADING,
});

// Thunk to fetch spot details and reviews
export const fetchSpotDetailsAndReviews = (spotId, userId) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const spotResponse = await csrfFetch(`/api/spots/${spotId}`);
    const spotData = await spotResponse.json();

    const previewImage = spotData.SpotImages?.find((img) => img.preview)?.url || null;
    const additionalImages = spotData.SpotImages?.filter((img) => !img.preview).map((img) => img.url) || [];

    // Fill in with empty string if fewer than 4 images are available
    const [photo1, photo2, photo3, photo4] = [...additionalImages, '', '', '', ''].slice(0, 4);

    // Attach extracted image data to the spotData object
    const spotWithImages = {
      ...spotData,
      previewImage,
      photo1,
      photo2,
      photo3,
      photo4,
    };

    dispatch(setSpotDetails(spotWithImages));

    const reviewsResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const { Reviews } = await reviewsResponse.json();

    // Sort reviews in reverse chronological order
    const sortedReviews = Reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    dispatch(setReviews(sortedReviews));

    // Check if the user has submitted a review
    const userHasReviewed = Reviews.some((review) => review.userId === userId);
    dispatch(setUserReviewStatus(userHasReviewed));
  } catch (error) {
    console.error('Error fetching spot details or reviews:', error);
  }
};

// Thunk to post a review
export const postReview = (spotId, reviewText, rating) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review: reviewText, stars: rating }),
  });

  if (!response.ok) {
    throw response;
  }

  const newReview = await response.json();
  dispatch(setReviews((prev) => [...prev, newReview]));
  return newReview;
};

// Thunk to delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete review');
  }

  dispatch(setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId)));
};

const initialState = {
  spot: {},
  reviews: [],
  hasReviewed: false,
  loading: true,
};

export default function spotDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return { ...state, loading: true };
    case SET_SPOT_DETAILS:
      return { ...state, spot: action.payload, loading: false };
    case SET_REVIEWS:
      return { ...state, reviews: Array.isArray(action.payload) ? action.payload : [] };
    case SET_USER_REVIEW_STATUS:
      return { ...state, hasReviewed: action.payload };
    case RESET_SPOT_DETAILS: // Reset case
      return initialState;
    default:
      return state;
  }
}
