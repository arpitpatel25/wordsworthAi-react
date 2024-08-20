import React, { useState, useEffect } from "react";
import { ChakraProvider, Flex, Box, Button, Text } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import URLInput from "./components/URLInput";
import Filters from "./components/Filters";
import ApplyFiltersButton from "./components/ApplyFiltersButton";
import MediaGrid from "./components/MediaGrid";
import MediaDetails from "./components/MediaDetails";
import { getBrandFilters, filterMediaPaginated } from "./api";

const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

function App() {
  const [brandUrl, setBrandUrl] = useState(() => localStorage.getItem('brandUrl') || "");
  const [availableFilters, setAvailableFilters] = useState(() => JSON.parse(localStorage.getItem('availableFilters')) || []);
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const savedFilters = localStorage.getItem('selectedFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
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
    };
  });

  const [mediaItems, setMediaItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const updateMediaItem = (updatedItem) => {
    setMediaItems((prevItems) => {
      return prevItems.map((item) => item._id === updatedItem._id ? updatedItem : item);
    });
  };

  useEffect(() => {
    const storedTimestamp = localStorage.getItem('timestamp');
    const currentTime = new Date().getTime();

    if (storedTimestamp && currentTime - storedTimestamp < EXPIRY_TIME) {
      setBrandUrl(localStorage.getItem('brandUrl') || "");
      setAvailableFilters(JSON.parse(localStorage.getItem('availableFilters')) || []);
      setSelectedFilters(JSON.parse(localStorage.getItem('selectedFilters')) || null);
    } else {
      localStorage.clear(); // Clear data if more than 10 minutes have passed
    }
  }, []);

  useEffect(() => {
    if (brandUrl) {
      localStorage.setItem('brandUrl', brandUrl);
      localStorage.setItem('timestamp', new Date().getTime());
    }
  }, [brandUrl]);

  useEffect(() => {
    if (availableFilters.length > 0) {
      localStorage.setItem('availableFilters', JSON.stringify(availableFilters));
      localStorage.setItem('timestamp', new Date().getTime());
    }
  }, [availableFilters]);

  useEffect(() => {
    if (selectedFilters) {
      localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
      localStorage.setItem('timestamp', new Date().getTime());
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (brandUrl && availableFilters.length > 0 && selectedFilters && !mediaItems.length) {
      applyFilters(); // Run only if all required data is available and mediaItems is empty
    }
  }, [brandUrl, availableFilters]);

  const fetchBrandFilters = async (url) => {
    try {
      localStorage.clear(); // Clear previous data when fetching new filters
      setMediaItems([]);
      setPage(1);
      setTotalPages(1);
      setSelectedFilters({
        brand_url: url,
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

      const response = await getBrandFilters(url);

      const apiFilters = [
        { name: "product_tag", values: (response.product_tag || []).filter(tag => tag.trim() !== ""), title: "Product Tags" },
        { name: "collection_tag", values: (response.collection_tag || []).filter(tag => tag.trim() !== ""), title: "Collection Tags" },
        { name: "show_pages", values: [true, false], title: "Show from Pages" },
        { name: "show_products", values: [true, false], title: "Show from Products" },
        { name: "show_collections", values: [true, false], title: "Show from Collections" },
        { name: "has_product", values: [true, false], title: "Has Product" },
        { name: "has_human", values: [true, false], title: "Has Human" },
        { name: "has_multiple_products", values: [true, false], title: "Has Multiple Products" },
        { name: "aspect_ratio", values: response.aspect_ratio || [], title: "Aspect Ratio" },
        { name: "media_type", values: ["image", "video"], title: "Media Type" },
      ];
      
      setAvailableFilters([...apiFilters]);
      updateBrandBaseUrl(url); // Update selectedFilters with brand URL
    } catch (error) {
      console.error("Error fetching brand filters:", error);
    }
  };

  const updateBrandBaseUrl = (brandUrl) => {
    setBrandUrl(brandUrl);
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      brand_url: brandUrl
    }));
  };

  const updateSelectedFilters = (filterName, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterName.endsWith("_gte") || filterName.endsWith("_lte") || filterName.endsWith("_eq")) {
        updatedFilters[filterName] = value;
        if (filterName.endsWith("_gte") || filterName.endsWith("_lte")) {
          updatedFilters[filterName.replace("_gte", "_eq").replace("_lte", "_eq")] = null;
        } else if (filterName.endsWith("_eq")) {
          updatedFilters[filterName.replace("_eq", "_gte")] = null;
          updatedFilters[filterName.replace("_eq", "_lte")] = null;
        }
      } else if (Array.isArray(updatedFilters[filterName])) {
        if (updatedFilters[filterName].includes(value)) {
          updatedFilters[filterName] = updatedFilters[filterName].filter((v) => v !== value);
        } else {
          updatedFilters[filterName] = [...updatedFilters[filterName], value];
        }
      } else {
        updatedFilters[filterName] = updatedFilters[filterName] === value ? null : value;
      }
      return updatedFilters;
    });
  };

  const fetchMediaItems = async (page) => {
    try {
      const aspectRatioFilter = availableFilters.find(f => f.name === "aspect_ratio");
      if (aspectRatioFilter) {
        const a_ratio_min_val = aspectRatioFilter.values[0];
        const a_ratio_max_val = aspectRatioFilter.values[1];

        if (
          (selectedFilters.aspect_ratio_gte !== null &&
            selectedFilters.aspect_ratio_gte !== undefined &&
            (selectedFilters.aspect_ratio_gte < a_ratio_min_val ||
              selectedFilters.aspect_ratio_gte > a_ratio_max_val)) ||
          (selectedFilters.aspect_ratio_lte !== null &&
            selectedFilters.aspect_ratio_lte !== undefined &&
            (selectedFilters.aspect_ratio_lte < a_ratio_min_val ||
              selectedFilters.aspect_ratio_lte > a_ratio_max_val))
        ) {
          alert("Aspect ratio values must be within the allowed range.");
          return;
        }

        if (
          selectedFilters.aspect_ratio_eq !== null &&
          selectedFilters.aspect_ratio_eq !== undefined &&
          (selectedFilters.aspect_ratio_eq < a_ratio_min_val ||
            selectedFilters.aspect_ratio_eq > a_ratio_max_val)
        ) {
          alert("Aspect ratio value must be within the allowed range.");
          return;
        }

        // Check that aspect_ratio_gte < aspect_ratio_lte
        if (
          selectedFilters.aspect_ratio_gte !== null &&
          selectedFilters.aspect_ratio_gte !== undefined &&
          selectedFilters.aspect_ratio_lte !== null &&
          selectedFilters.aspect_ratio_lte !== undefined &&
          selectedFilters.aspect_ratio_gte >= selectedFilters.aspect_ratio_lte
        ) {
          alert("Min value must be less than max value.");
          return;
        }
      }

      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(selectedFilters)) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((val) => queryParams.append(key, val));
        } else if (!Array.isArray(value) && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      }

      const apiUrl = `http://127.0.0.1:5000/filter_media_page?${queryParams.toString()}`;
      const filteredMedia = await filterMediaPaginated(apiUrl, page);

      const uniqueMediaItems = filteredMedia.results.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.media_url === item.media_url)
      );

      if (uniqueMediaItems.length === 0) {
        alert("No Media found for these filters.");
      }

      setMediaItems(uniqueMediaItems);
      setTotalPages(Math.ceil(filteredMedia.count / filteredMedia.per_page));
    } catch (error) {
      console.error("Error fetching media items:", error);
      alert("Error fetching media items:", error);
      setMediaItems([]);
    }
  };

  const applyFilters = () => {
    setMediaItems([]);
    setPage(1);
    setTotalPages(1);
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
    <ChakraProvider>
      <Router>
        <Flex direction="column" height="100vh">
          <Box bg="gray.100" p={4}>
            <URLInput fetchBrandFilters={fetchBrandFilters} brandUrl={brandUrl} />
          </Box>
          <Flex flex="1">
            <Box width="300px" p={4} bg="gray.50" borderRight="1px solid #ccc">
              <Filters
                availableFilters={availableFilters}
                selectedFilters={selectedFilters}
                updateSelectedFilters={updateSelectedFilters}
                applyFilters={applyFilters}
              />
              <Box mt={4}>
                <ApplyFiltersButton applyFilters={applyFilters} />
              </Box>
            </Box>
            <Box flex="1" p={4}>
              <Routes>
                <Route path="/" element={
                  <>
                    <Flex justify="flex-end" align="center" mb={4}>
                      <Flex alignItems="center">
                        <Button onClick={handlePrevPage} mr={2} disabled={page <= 1}>
                          Previous
                        </Button>
                        <Text mr={2}>
                          Page {page} of {totalPages}
                        </Text>
                        <Button onClick={handleNextPage} disabled={page >= totalPages}>
                          Next
                        </Button>
                      </Flex>
                    </Flex>
                    <MediaGrid mediaItems={mediaItems} initialLoad={mediaItems.length === 0 && page === 1} />
                  </>
                } />
                <Route path="/media-details" element={<MediaDetails updateMediaItem={updateMediaItem} />} />
                <Route path="/media/:id" element={<MediaDetails updateMediaItem={updateMediaItem} />} />
              </Routes>
            </Box>
          </Flex>
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
