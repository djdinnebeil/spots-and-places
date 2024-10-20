// frontend/src/store/spots.js
import { csrfFetch } from './csrf';

const SET_SPOTS = 'spots/SET_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT';
const SET_CURRENT_USER_SPOTS = 'spots/SET_CURRENT_USER_SPOTS';

const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  payload: spot,
});

const setCurrentUserSpots = (spots) => ({
  type: SET_CURRENT_USER_SPOTS,
  payload: spots,
});

// Thunk to fetch user's current spots
export const fetchCurrentUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  const data = await response.json();
  dispatch(setCurrentUserSpots(data.Spots));
  return data.Spots;
};

// Thunk to fetch all spots
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();
  dispatch(setSpots(data.Spots));
  return response;
};

// Thunk to create a new spot
export const createNewSpot = (spotData) => async (dispatch) => {
  const { previewImage, photo1, photo2, photo3, photo4, ...spotInfo } = spotData;
  const photos = [photo1, photo2, photo3, photo4].filter(Boolean); // Remove empty photo fields

  // Post the spot
  const spotResponse = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotInfo),
  });

  if (!spotResponse.ok) {
    const errorData = await spotResponse.json();
    throw new Error(errorData.message || 'Failed to create spot');
  }

  const newSpot = await spotResponse.json(); // Retrieve the created spot with its ID
  const { id: spotId } = newSpot; // Extract spotId

  if (previewImage) {
    await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: previewImage, preview: true }),
    });
  }

  for (const photo of photos) {
    await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: photo, preview: false }),
    });
  }

  dispatch(addSpot(newSpot));
  return newSpot;
};

// Thunk to update an existing spot
export const updateSpot = (spotId, spotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update spot');
  }

  const updatedSpot = await response.json();
  dispatch(addSpot(updatedSpot));
  return updatedSpot;
};

// Thunk to delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete spot');
  }

  dispatch(fetchCurrentUserSpots());
};

const initialState = { spots: [], currentUserSpots: [] };

export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, spots: action.payload };
    case ADD_SPOT:
      return { ...state, spots: [...state.spots, action.payload] };
    case SET_CURRENT_USER_SPOTS:
      return { ...state, currentUserSpots: action.payload };
    default:
      return state;
  }
}
