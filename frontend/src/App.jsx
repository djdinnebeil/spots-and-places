// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import ListAllSpots from "./components/ListAllSpots";
import SpotDetailsPage from './components/SpotDetailsPage';
import CreateNewSpotPage from './components/CreateNewSpotPage';
import CurrentUserSpots from "./components/CurrentUserSpots/index.js";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded}/>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <ListAllSpots />
        )
      },
      {
        path: '/spots/:spotId',
        element: (
          <SpotDetailsPage />
        )
      },
      {
        path: '/spots/new',
        element: (
          <CreateNewSpotPage />
        )
      },
      {
        path: '/spots/current',
        element: (
          <CurrentUserSpots />
        )
      },
      {
        path: '/spots/:spotId/edit',
        element: (
          <CreateNewSpotPage isUpdate={true} />
        )
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
