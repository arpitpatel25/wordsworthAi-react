import React from "react";
import { Box, Text, Tag, TagLabel, TagCloseButton, VStack, Divider } from "@chakra-ui/react";
import Select from "react-select";

function TagSelector({ filterTitle, availableTags, selectedTags, onSelect, onRemove }) {
  const handleSelect = (selectedOption) => {
    onSelect(selectedOption.value);
  };

  const options = availableTags.map(tag => ({
    value: tag,
    label: tag
  }));

  return (
    <Box mb={4}>
      <Text mb={2} fontWeight="bold">{filterTitle}</Text>
      <Select
        options={options}
        onChange={handleSelect}
        placeholder={`Search ${filterTitle}...`}
      />
      <VStack mt={2} align="start" spacing={2}>
        {selectedTags.map((tag, index) => (
        //   <React.Fragment key={tag}>
            <Tag size="md" variant="solid" colorScheme="blue">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => onRemove(tag)} />
            </Tag>
        //     {index < selectedTags.length - 1 && (
        //       <Divider borderColor="gray.400" borderWidth="2px" opacity="0.6" />
        //     )} {/* Add a thicker and more opaque grey divider between tags */}
        //   </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
}

export default TagSelector;
