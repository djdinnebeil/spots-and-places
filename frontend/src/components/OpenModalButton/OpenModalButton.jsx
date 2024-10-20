// frontend/src/components/OpenModalButton/OpenModalButton.jsx
import { useModal } from '../../context/Modal';

function OpenModalButton(
  {
    modalComponent, // component to render inside the modal
    dataTestId,
    buttonClassName,
    buttonText,
    onButtonClick,
    onModalClose
  }) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button data-testid={dataTestId} className={buttonClassName} onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
