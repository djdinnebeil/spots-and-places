// frontend/src/components/Navigation/ProfileButton.jsx
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CgProfile } from 'react-icons/cg'; // Profile icon not signed in
import { FaUserCircle } from 'react-icons/fa'; // Profile icon signed in
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css';
import { useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  // Toggle the dropdown menu
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  // Logout function
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  const manageSpots = (e) => {
    e.preventDefault();
    navigate('/spots/current');
  }

  // Dropdown class based on whether the menu is shown
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className="profile-button" data-testid="user-menu-button">
        <div className="navicon" aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {user ? (<FaUserCircle size={40}/>) : (<CgProfile size={40}/>)}
      </button>
      <div className={ulClassName} data-testid="user-dropdown-menu" ref={ulRef}>
        {user ? (
          <div className="profile-user">
            <li className='profile-no-hover'>Hello, {user.firstName}</li>
            <li className='profile-no-hover'>{user.email}</li>
            <hr />
            <li data-testid={'manage-spots-link'} onClick={manageSpots}>Manage Spots</li>
            <hr />
            <li>
              <button onClick={logout} className="logout-button">Log Out</button>
            </li>
          </div>
        ) : (
          <>
            <li className='left-align-profile-dropdown'>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal/>}
              />
            </li>
            <li className='left-align-profile-dropdown'>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal/>}
              />
            </li>
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
