import React from "react";
import FilterItem from "./FilterItem";
import RangeOrExactFilter from "./RangeOrExactFilter";

function Filters({ availableFilters, selectedFilters, updateSelectedFilters }) {
  return (
    <div>
      {availableFilters.map((filter) =>
        filter.name === "aspect_ratio" || filter.name === "file_size" ? (
          <RangeOrExactFilter
            key={filter.name}
            filterName={filter.name}
            filterValues={filter.values}
            updateSelectedFilters={updateSelectedFilters}
          />
        ) : (
          <FilterItem
            key={filter.name}
            filterName={filter.name}
            filterValues={filter.values}
            selectedValues={selectedFilters[filter.name]}
            updateSelectedFilters={updateSelectedFilters}
          />
        ),
      )}
    </div>
  );
}

export default Filters;
