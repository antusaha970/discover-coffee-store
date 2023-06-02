import { useContext, useState } from "react";
import { ACTION_TYPE, StoreContext } from "../pages/_app";

const userLocation = () => {
  // const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const { dispatch } = useContext(StoreContext);
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const fakeLati = "43.6532";
    const fakeLongi = "-79.3832";
    // setLocation(`${fakeLati},${fakeLongi}`);
    dispatch({
      type: ACTION_TYPE.SET_LAT_LONG,
      payload: {
        latLong: `${fakeLati},${fakeLongi}`,
      },
    });
    setLocationError("");
    setIsLocating(false);
  };

  const error = () => {
    setLocationError("Unable to retrieve your location");
    setIsLocating(false);
  };
  const handleTrackLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // location,
    handleTrackLocation,
    locationError,
    isLocating,
  };
};

export default userLocation;
