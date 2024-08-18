import React, { useState } from "react";
import { Button, Box, Input, Text } from "@chakra-ui/react";

function RangeOrExactFilter({
  filterName,
  filterTitle,
  filterValues,
  updateSelectedFilters,
}) {
  const [mode, setMode] = useState("range"); // 'range' or 'exact'
  const [isEnabled, setIsEnabled] = useState(false);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    updateSelectedFilters(fieldName, parseFloat(value));
  };

  const toggleEnable = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      updateSelectedFilters(`${filterName}_gte`, null);
      updateSelectedFilters(`${filterName}_lte`, null);
      updateSelectedFilters(`${filterName}_eq`, null);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    if (newMode === "range") {
      updateSelectedFilters(`${filterName}_eq`, null);
    } else {
      updateSelectedFilters(`${filterName}_gte`, null);
      updateSelectedFilters(`${filterName}_lte`, null);
    }
  };

  return (
    <Box mb={4}>
      <Text fontWeight="bold">{filterTitle}</Text>
      <Button
        onClick={toggleEnable}
        bg={isEnabled ? "blue.500" : "gray.200"}
        // color="white"
        mb={2}
      >
        {isEnabled ? "Disable Filter" : "Enable Filter"}
      </Button>
      {isEnabled && (
        <Box>
          <Box>
            <Button
              onClick={() => switchMode("range")}
              bg={mode === "range" ? "blue.500" : "gray.200"}
            //   color="white"
              mr={2}
            >
              Set Range
            </Button>
            <Button
              onClick={() => switchMode("exact")}
              bg={mode === "exact" ? "blue.500" : "gray.200"}
            //   color="white"
            >
              Set Exact Value
            </Button>
          </Box>
          {mode === "range" ? (
            <Box mt={2}>
              <Input
                type="number"
                placeholder={'Greater than'}
                onChange={(e) => handleInputChange(e, `${filterName}_gte`)}


                mr={2}
              />
              <Input
                type="number"
                placeholder={'Less than'}
                onChange={(e) => handleInputChange(e, `${filterName}_lte`)}

              />
            </Box>
          ) : (
            <Box mt={2}>
              <Input
                type="number"
                placeholder={'Equal to'}
                onChange={(e) => handleInputChange(e, `${filterName}_eq`)}
              />
            </Box>
          )}
          <Text mt={2}>Min, Max: ({filterValues[0]}, {filterValues[1]})</Text>
        </Box>
      )}
    </Box>
  );
}

export default RangeOrExactFilter;
