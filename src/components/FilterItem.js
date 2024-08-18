import React from "react";
import { Button, Box, Text } from "@chakra-ui/react";

function FilterItem({
  filterName,
  filterTitle,
  filterValues,
  selectedValues,
  updateSelectedFilters,
}) {
  const isArray = Array.isArray(selectedValues);
  console.log("Name::: ",filterTitle)
  return (
    <Box mb={4}>
      <Text fontWeight="bold">{filterTitle}</Text>
      <Box>
        {filterValues.map((value) => (
          <Button
            key={value}
            onClick={() => updateSelectedFilters(filterName, value)}
            bg={(isArray && selectedValues.includes(value)) || selectedValues === value ? "blue.500" : "gray.200"}
            color={(isArray && selectedValues.includes(value)) || selectedValues === value ? "white" : "black"}
            m={1}
          >
            {value.toString()}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default FilterItem;
