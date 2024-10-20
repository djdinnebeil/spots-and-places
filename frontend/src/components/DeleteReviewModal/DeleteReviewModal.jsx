// frontend/src/components/DeleteReviewModal/DeleteReviewModal.jsx
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/spotDetails';
import './DeleteReviewModal.css';

const DeleteReviewModal = ({ reviewId, onReviewSubmit }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(reviewId));
      onReviewSubmit();
      closeModal();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <div className="delete-modal" data-testid={'delete-review-modal'}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="delete-review-button-group">
        <button data-testid={'confirm-delete-review-button'} onClick={handleDelete} className="confirm-button">Yes (Delete Review)</button>
        <button onClick={closeModal} className="cancel-button">No (Keep Review)</button>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
