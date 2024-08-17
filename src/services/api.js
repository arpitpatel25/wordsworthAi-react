import axios from "axios";

export const getBrandFilters = (brandUrl) => {
  return axios.get("http://127.0.0.1:5000/get_brand_filters", {
    params: { brand_url: brandUrl },
  });
};

export const filterMedia = (brandUrl, filterCriteria) => {
  return axios.get("http://127.0.0.1:5000/filter_media", {
    params: {
      brand_url: brandUrl,
      ...filterCriteria,
    },
  });
};
