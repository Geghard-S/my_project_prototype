import './App.css';
import Map from './MapSection';
import { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

import useSavedJobs from './hooks/useSavedJobs';

window.gaid = process.env.REACT_APP_GOOGLE_ACCOUNT_CLIENT_ID

function App() {
  const [user, setUser] = useState(null);
  const savedJobs = useSavedJobs();

  const onSuccess = res => {
    var userObject = jwt_decode(res.credential);
    setUser(userObject);
  }

  function handleSignOut() {
    googleLogout();
    setUser(null);
  }

  return (
    <div className="App parent">

      <header>
        <div className='flex align-center'>
          <>
            <img className="logo" alt="Company Logo" src="./icon.png" />
            <p className='nametext'>COMPANY NAME</p>
          </>
        </div>
        {!user &&
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
            auto_select
          />}

        {user &&
          <div className='flex align-center'>
            <div className="user-profile child">
              <img alt="user profile pic" src={user.picture}></img>
              <h3>{user.name}</h3>
            </div>

            <div className="sign-out-container">
              <button onClick={(e) => handleSignOut(e)}> Sign Out </button>
            </div>
          </div>
        }
      </header>
      <div className="map parent mainBody">
        {savedJobs && user && (
          <Map savedJobs={savedJobs} />
        )}
        <footer>
          <p id='copyright'>© 2023 Gerard Simonian. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
