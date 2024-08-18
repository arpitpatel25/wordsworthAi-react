export const getBrandFilters = async (brandUrl) => {
  const response = await fetch(
    `http://127.0.0.1:5000/get_brand_filters?brand_url=${brandUrl}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch brand filters");
  }
  return response.json(); // Returns the filters object
};

export const filterMedia = async (apiUrl) => {
  // const apiUrl = `http://127.0.0.1:5000/filter_media?${queryParams.toString()}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch filtered media");
  }
  return response.json(); // Returns the filtered media
};

export const filterMediaPaginated = async (apiUrl, page = 1, perPage = 20) => {
    const response = await fetch(`${apiUrl}&page=${page}&per_page=${perPage}`);
    if (!response.ok) {
      throw new Error("Failed to fetch paginated filtered media");
    }
    return response.json(); // Returns the paginated filtered media
  };
  