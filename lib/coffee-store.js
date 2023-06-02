import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrl = (query, latiTi, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latiTi}&limit=${limit}`;
};

const fetchCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee store",
    page: 1,
    perPage: 40,
  });
  const unSplashPhoto = photos.response.results;
  return unSplashPhoto.map((photo) => photo.urls.small);
};
export async function fetchCoffeeStores(
  latLong = "43.6532%2C-79.3832",
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

  const response = await fetch(getUrl("coffee", latLong, limit), options);
  const data = await response.json();
  // .catch((err) => console.error(err));
  return data.results.map((result, id) => {
    const neighborhood = result.location.locality;
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address,
      neighbourhood: neighborhood.length > 0 ? neighborhood : "",
      imgUrl: photos.length > 0 ? photos[id] : null,
    };
  });
}
