import React from "react";
import { Box, Button } from "@chakra-ui/react";

function ApplyFiltersButton({ applyFilters }) {
  return (
    <Box textAlign="center" padding="20px">
      <Button onClick={applyFilters} padding="10px 20px" colorScheme="blue">
        Apply Filters
      </Button>
    </Box>
  );
}

export default ApplyFiltersButton;
