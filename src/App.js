

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import Home from "./Components/Home/Home";
import Auth from "./Components/Auth/Auth";
import { auth, getUserFromDatabase } from "./firebase";
import Spinner from "./Components/Spinner/Spinner";
import Account from "./Components/Account/Account";


export default function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isDataLoaded, setisDataLoaded] = useState(false);
  
  const fetchUserDetails = async(uid) => {
    const userDetails = await getUserFromDatabase(uid);
    setUserDetails(userDetails);
    setisDataLoaded(true);
  }
  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (!user) {
        setisDataLoaded(true);
        setisAuthenticated(false);
        return;
      }

      setisAuthenticated(true);
      fetchUserDetails(user.uid);
    });
    return () => listener();
  }, []);

  return (
    <div className="min-h-full h-fit w-full">
      <Router>
        {isDataLoaded ? (
          <Routes>
            {!isAuthenticated && (
              <>
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth signup />} />
              </>
            )}

            <Route path="/account" element={<Account userDetails = {userDetails} auth = {isAuthenticated}/>} />
            <Route path="/" element={<Home auth={isAuthenticated} />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Spinner />
        )}
      </Router>
    </div>
  );
}
