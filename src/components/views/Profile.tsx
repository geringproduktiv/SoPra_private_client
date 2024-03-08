import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";

interface UserProfile {
  username: string;
  onlineStatus: boolean;
  creationDate: Date;
  birthDate: Date;
  }
  
const Profile: React.FC = () => {
  // Capture the userId from the URL
  const { userId } = useParams<{ userId: string }>();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const navigateToEdit = () => {
    navigate(`/edit/${userId}`);
  }

  const navigateBack = () => {
    navigate("/game");
  }

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData(userId: string) {
      try {
        const response = await api.get(`/users/${userId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned user and update the state.
        setUserProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData(userId);
  }, [userId]);

  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <h1>Profile</h1>
          <p>Username: {userProfile.username}</p>
          <p>Online Status: {userProfile.onlineStatus ? "Online" : "Offline"}</p>
          <p>Creation Date: {userProfile.creation_date}</p>
          <p>Birth Date: {userProfile.birthday}</p>
          <div className="login button-container">
            <Button
              disabled={token !== userProfile.token}
              width="100%"
              onClick={() => navigateToEdit()}
            >
              Edit Profile
            </Button>
          </div>
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => navigateBack()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Profile;
