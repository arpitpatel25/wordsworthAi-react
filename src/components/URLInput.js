import React, { useState, useEffect } from "react";
import { Box, Input, Button } from "@chakra-ui/react";

function URLInput({ fetchBrandFilters, brandUrl }) {
  const [url, setUrl] = useState(brandUrl || ""); // Initialize with brandUrl if not empty

  useEffect(() => {
    setUrl(brandUrl || ""); // Set input value to brandUrl when available
  }, [brandUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBrandFilters(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box textAlign="center" padding="20px">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter brand URL"
          width="60%"
          marginRight="10px"
        />
        <Button type="submit" colorScheme="blue">
          Fetch Filters
        </Button>
      </Box>
    </form>
  );
}

export default URLInput;
