// frontend/src/components/ConfirmDeleteModal/ConfirmDeleteModal.jsx
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ spotId, handleDeleteRefresh }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteSpot(spotId));
      closeModal();
      handleDeleteRefresh();
    } catch (error) {
      console.error('Failed to delete spot:', error);
    }
  };

  return (
    <div className="delete-spot-modal" data-testid={'delete-spot-modal'}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className="delete-modal-button-group">
        <button data-testid={'confirm-delete-spot-button'} onClick={handleDelete} className="delete-spot-confirm-button">Yes (Delete Spot)</button>
        <button data-testid={'cancel-delete-spot-button'} onClick={closeModal} className="delete-spot-cancel-button">No (Keep Spot)</button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
