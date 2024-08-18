// import React from "react";
// import { Box } from "@chakra-ui/react";
// import FilterItem from "./FilterItem";
// import RangeOrExactFilter from "./RangeOrExactFilter";

// import TagSelector from "./TagSelector";

// function Filters({ availableFilters, selectedFilters, updateSelectedFilters }) {
//   const handleSelectTag = (filterName, tag) => {
//     updateSelectedFilters(filterName, tag);
//   };

//   const handleRemoveTag = (filterName, tag) => {
//     updateSelectedFilters(filterName, tag); // This will remove the tag
//   };

//   const productTags = availableFilters.find(f => f.name === "product_tag")?.values || [];
//   const collectionTags = availableFilters.find(f => f.name === "collection_tag")?.values || [];

//   return (
//     <Box>
//       {availableFilters.map((filter) => {
//         if (filter.name === "aspect_ratio" || filter.name === "file_size") {
//           return (
//             <RangeOrExactFilter
//               key={filter.name}
//               filterTitle={filter.title}
//               filterName={filter.name}
//               filterValues={filter.values}
//               updateSelectedFilters={updateSelectedFilters}
//             />
//           );
//         } else if (filter.name === "product_tag") {
//           return (
//             <TagSelector
//               key={filter.name}
//               filterTitle={filter.title}
//               availableTags={productTags}
//               selectedTags={selectedFilters.product_tag || []}
//               onSelect={(tag) => handleSelectTag("product_tag", tag)}
//               onRemove={(tag) => handleRemoveTag("product_tag", tag)}
//             />
//           );
//         } else if (filter.name === "collection_tag") {
//           return (
//             <TagSelector
//               key={filter.name}
//               filterTitle={filter.title}
//               availableTags={collectionTags}
//               selectedTags={selectedFilters.collection_tag || []}
//               onSelect={(tag) => handleSelectTag("collection_tag", tag)}
//               onRemove={(tag) => handleRemoveTag("collection_tag", tag)}
//             />
//           );
//         } else {
//           return (
//             <FilterItem
//               key={filter.name}
//               filterName={filter.name}
//               filterTitle={filter.title}
//               filterValues={filter.values}
//               selectedValues={selectedFilters[filter.name]}
//               updateSelectedFilters={updateSelectedFilters}
//             />
//           );
//         }
//       })}
//     </Box>
//   );
// }

// export default Filters;
import React from "react";
import { Box, Heading, Flex, Button, VStack } from "@chakra-ui/react";
import FilterItem from "./FilterItem";
import RangeOrExactFilter from "./RangeOrExactFilter";
import TagSelector from "./TagSelector";

function Filters({ availableFilters, selectedFilters, updateSelectedFilters, applyFilters }) {
  const handleSelectTag = (filterName, tag) => {
    updateSelectedFilters(filterName, tag);
  };

  const handleRemoveTag = (filterName, tag) => {
    updateSelectedFilters(filterName, tag); // This will remove the tag
  };

  const productTags = availableFilters.find(f => f.name === "product_tag")?.values || [];
  const collectionTags = availableFilters.find(f => f.name === "collection_tag")?.values || [];

  return (
    <Box fontSize="18px">
      {/* Title and Apply Filters Button */}
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="lg">
          Filters
        </Heading>
        <Button onClick={applyFilters} colorScheme="blue" size="sm">
          Apply Filters
        </Button>
      </Flex>

      {/* Stack filters with spacing */}
      <VStack spacing={6} align="start">
        {availableFilters.map((filter) => {
          if (filter.name === "aspect_ratio" || filter.name === "file_size") {
            return (
              <RangeOrExactFilter
                key={filter.name}
                filterTitle={filter.title}
                filterName={filter.name}
                filterValues={filter.values}
                updateSelectedFilters={updateSelectedFilters}
              />
            );
          } else if (filter.name === "product_tag") {
            return (
              <TagSelector
                key={filter.name}
                filterTitle={filter.title}
                availableTags={productTags}
                selectedTags={selectedFilters.product_tag || []}
                onSelect={(tag) => handleSelectTag("product_tag", tag)}
                onRemove={(tag) => handleRemoveTag("product_tag", tag)}
              />
            );
          } else if (filter.name === "collection_tag") {
            return (
              <TagSelector
                key={filter.name}
                filterTitle={filter.title}
                availableTags={collectionTags}
                selectedTags={selectedFilters.collection_tag || []}
                onSelect={(tag) => handleSelectTag("collection_tag", tag)}
                onRemove={(tag) => handleRemoveTag("collection_tag", tag)}
              />
            );
          } else {
            return (
              <FilterItem
                key={filter.name}
                filterName={filter.name}
                filterTitle={filter.title}
                filterValues={filter.values}
                selectedValues={selectedFilters[filter.name]}
                updateSelectedFilters={updateSelectedFilters}
              />
            );
          }
        })}
      </VStack>
    </Box>
  );
}

export default Filters;
