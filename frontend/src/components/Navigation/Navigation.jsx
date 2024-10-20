// frontend/src/components/Navigation/Navigation.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRefresh = () => {
    if (location.pathname === '/spots/new') {
      navigate(0);
    }
  }

  return (
    <header className="navigation">
      <div className="nav-left">
        <Link to="/" className="site-logo" data-testid="logo">
          <img src='https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/site-icon.png' alt="Site Logo" className="logo" />
          <span className="site-name">Spots and Places</span>
        </Link>
      </div>
      <div className="nav-right">
        {sessionUser && (
          <Link data-testid={'create-new-spot-button'} className='create-new-spot' to='/spots/new' onClick={handleRefresh}>
            Create a New Spot
          </Link>)}
        <ProfileButton user={sessionUser}/>
      </div>
    </header>
  );
}

export default Navigation;
