// frontend/src/components/PostReviewModal/PostReviewModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { postReview } from '../../store/spotDetails';
import './PostReviewModal.css';

function PostReviewModal({ spotId, onReviewSubmit  }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await dispatch(postReview(spotId, reviewText, rating));
      onReviewSubmit();
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data?.message) {
        setErrors({ review: data.message });
      }
    }
  };

  const isButtonDisabled = reviewText.length < 10 || rating === 0;

  return (
    <div className="modal-box" data-testid={'review-modal'}>
      <h1 className="post-title">How was your stay?</h1>
      {errors.review && <p className="error-message">{errors.review}</p>}
      <form onSubmit={handleSubmit} className="review-form" data-testid={'review-form'}>
        <textarea
          placeholder="Leave your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          className="textarea-field"
        />
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'selected' : ''}`}
              onClick={() => setRating(star)}
              data-testid={'review-star-clickable'}
            >
              ★
            </span>
          ))}
          <label className='stars-label'>Stars</label>
        </div>
        <button
          type="submit"
          className="post-review-button"
          disabled={isButtonDisabled}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default PostReviewModal;
