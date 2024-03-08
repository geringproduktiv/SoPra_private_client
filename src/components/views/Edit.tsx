import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

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

  const navigateBack = () => {
    navigate(`/profile/${userId}`);
  }

  const doEdit = async (user) => {
    try {
      const id = user.id;
      const username = user.username;
      const birthday = user.birthday;
      
      const requestBody = JSON.stringify({id, username, birthday});
      const response = await api.put(`/users/${userId}`, requestBody);

      navigateBack();
    } catch (error) {
      alert(
        `Something went wrong during the update: \n${handleError(error)}`
      );
    }
  };

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
          <FormField
            label="Username"
            value={userProfile.username}
            placeholder="Enter here..."
            onChange={(username: string) => setUserProfile({ ...userProfile, username })}
          />
          <FormField
            label="Birthday"
            value={userProfile.birthday}
            placeholder="YYYY-MM-DD"
            onChange={(birthday: Date) => setUserProfile({ ...userProfile, birthday })}
          />
          <p>online status: {userProfile.onlineStatus ? "Online" : "Offline"}</p>
          <p>creation date: {userProfile.creation_date}</p>
          <div className="login button-container">
            <Button
              disabled={token !== userProfile.token}
              width="100%"
              onClick={() => doEdit(userProfile)}
            >
              Save
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
