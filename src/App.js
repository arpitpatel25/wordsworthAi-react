import React, { useState } from "react";
import URLInput from "./components/URLInput";
import Filters from "./components/Filters";
import ApplyFiltersButton from "./components/ApplyFiltersButton";
import { getBrandFilters, filterMediaPaginated } from "./api";
import MediaGrid from "./components/MediaGrid";  // Import the MediaGrid component

function App() {
  const [brandUrl, setBrandUrl] = useState("");
  const [availableFilters, setAvailableFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    brand_url: brandUrl,
    media_type: null,
    has_product: null,
    has_human: null,
    has_multiple_products: null,
    show_pages: true,
    show_collections: true,
    show_products: true,
    aspect_ratio_gte: null,
    aspect_ratio_lte: null,
    aspect_ratio_eq: null,
    file_size_gte: null,
    file_size_lte: null,
    file_size_eq: null,
    product_tag: [],
    collection_tag: [],
  });
  
  const [mediaItems, setMediaItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBrandFilters = async (url) => {
    try {
      const response = await getBrandFilters(url);
      const fixedFilters = [
        { name: "media_type", values: ["image", "video"] },
        { name: "has_product", values: [true, false] },
        { name: "has_human", values: [true, false] },
        { name: "has_multiple_products", values: [true, false] },
        { name: "show_pages", values: [true, false] },
        { name: "show_products", values: [true, false] },
        { name: "show_collections", values: [true, false] },
      ];

      const apiFilters = [
        { name: "aspect_ratio", values: response.aspect_ratio || [] },
        { name: "file_size", values: response.file_size || [] },
        { name: "product_tag", values: response.product_tag || [] },
        { name: "collection_tag", values: response.collection_tag || [] },
      ];
      setAvailableFilters([...fixedFilters, ...apiFilters]);
      updateBrandBaseUrl(url); // Update selectedFilters with brand URL
    } catch (error) {
      console.error("Error fetching brand filters:", error);
    }
  };

  const updateBrandBaseUrl = (brandUrl) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters["brand_url"] = brandUrl;
      return updatedFilters;
    });
  };

  const updateSelectedFilters = (filterName, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (
        filterName.endsWith("_gte") ||
        filterName.endsWith("_lte") ||
        filterName.endsWith("_eq")
      ) {
        updatedFilters[filterName] = value;
        // Clear other related fields if one is set
        if (filterName.endsWith("_gte") || filterName.endsWith("_lte")) {
          updatedFilters[
            filterName.replace("_gte", "_eq").replace("_lte", "_eq")
          ] = null;
        } else if (filterName.endsWith("_eq")) {
          updatedFilters[filterName.replace("_eq", "_gte")] = null;
          updatedFilters[filterName.replace("_eq", "_lte")] = null;
        }
      } else if (Array.isArray(updatedFilters[filterName])) {
        if (updatedFilters[filterName].includes(value)) {
          updatedFilters[filterName] = updatedFilters[filterName].filter(
            (v) => v !== value,
          );
        } else {
          updatedFilters[filterName] = [...updatedFilters[filterName], value];
        }
      } else {
        if (updatedFilters[filterName] === value) {
          updatedFilters[filterName] = null;
        } else {
          updatedFilters[filterName] = value;
        }
      }

      return updatedFilters;
    });
  };

  const fetchMediaItems = async (page) => {
    try {
      const queryParams = new URLSearchParams();

      for (const [key, value] of Object.entries(selectedFilters)) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((val) => queryParams.append(key, val));
        } else if (
          !Array.isArray(value) &&
          value !== null &&
          value !== undefined
        ) {
          queryParams.append(key, value);
        }
      }

      const apiUrl = `http://127.0.0.1:5000/filter_media_page?${queryParams.toString()}`;
      const filteredMedia = await filterMediaPaginated(apiUrl, page);

      // Filter out duplicate media_urls
      const uniqueMediaItems = filteredMedia.results.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.media_url === item.media_url)
      );

      setMediaItems(uniqueMediaItems);
      setTotalPages(Math.ceil(filteredMedia.count / filteredMedia.per_page));
    } catch (error) {
      console.error("Error fetching media items:", error);
      setMediaItems([]);
    }
  };

  const applyFilters = () => {
    // Reset the media items, page, and total pages
    setMediaItems([]);
    setPage(1);
    setTotalPages(1);
    
    // Fetch media items starting from page 1
    fetchMediaItems(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchMediaItems(newPage);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchMediaItems(newPage);
    }
  };

  return (
    <div>
      <URLInput fetchBrandFilters={fetchBrandFilters} />
      <Filters
        availableFilters={availableFilters}
        selectedFilters={selectedFilters}
        updateSelectedFilters={updateSelectedFilters}
      />
      <ApplyFiltersButton applyFilters={applyFilters} />
      <div>
        <button onClick={handlePrevPage} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page >= totalPages}>
          Next
        </button>
      </div>
      <MediaGrid mediaItems={mediaItems} />
    </div>
  );
}

export default App;
