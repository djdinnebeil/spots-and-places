// frontend/src/components/SignupFormModal/SignupFormModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm password field must be the same as the password field"
    });
  };

  const isButtonDisabled = username.length < 4 || password.length < 6 || firstName === '' || lastName === '' || email === '' || confirmPassword === '';

  return (
    <div className="modal-box">
      <h1 className='sign-up'>Sign Up</h1>
      {(errors.email || errors.username) && <div className='errors-sign-up-div'>
      {errors.email && <p data-testid={'email-error-message'} className='errors-sign-up'>{errors.email}</p>}
      {errors.username && <p data-testid={'username-error-message'} className='errors-sign-up'>{errors.username}</p>}
      </div>}
      <form data-testid="sign-up-form" onSubmit={handleSubmit} >
        <label>
          First Name
        </label>
        <input
          data-testid="first-name-input"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className='errors-sign-up'>{errors.firstName}</p>}
        <label>
          Last Name
        </label>
        <input
          data-testid="last-name-input"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className='errors-sign-up'>{errors.lastName}</p>}
        <label>
          Email
        </label>
        <input
          data-testid={'email-input'}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>
          Username
        </label>
        <input
          data-testid={'username-input'}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>
          Password
        </label>
        <input
          data-testid={'password-input'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        {errors.password && <p className='errors-sign-up'>{errors.password}</p>}
        <label>
          Confirm Password
        </label>
        <input
          data-testid={'confirm-password-input'}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <div className='errors-sign-up-div'><p className='errors-sign-up'>{errors.confirmPassword}</p></div>
        )}
        <button
          data-testid={'form-sign-up-button'}
          type="submit"
          disabled={isButtonDisabled}
          className='signup-button'
        >
        Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
