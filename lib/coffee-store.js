import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrl = (query, latiTi, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latiTi}&limit=${limit}&radius=100000`;
};

const fetchCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "Indian restaurant",
    page: 1,
    perPage: 40,
  });
  const unSplashPhoto = photos.response.results;
  return unSplashPhoto.map((photo) => photo.urls.small);
};

export async function fetchCoffeeStores(
  latLong = "23.8103%2C90.4125",
  limit = 6
) {
  const photos = await fetchCoffeeStoresPhotos();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_API_KEY,
    },
  };

  const response = await fetch(getUrl("restaurant", latLong, limit), options);
  const data = await response.json();
  // .catch((err) => console.error(err));
  return data.results.map((result, id) => {
    const neighborhood = result.location.locality;
    console.log(result);
    return {
      id: result.fsq_id,
      name: result.name,
      address:
        result.location.address ||
        result?.location?.country ||
        result?.location?.formatted_address ||
        result?.location?.country,
      neighbourhood:
        neighborhood?.length > 0
          ? neighborhood
          : result.location.address ||
            result?.location?.country ||
            result?.location?.formatted_address ||
            result?.location?.country,
      imgUrl: photos.length > 0 ? photos[id] : null,
    };
  });
}
