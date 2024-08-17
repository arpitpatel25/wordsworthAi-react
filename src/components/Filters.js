import React from 'react';
import FilterItem from './FilterItem';

function Filters({ availableFilters, selectedFilters, updateSelectedFilters }) {
  return (
    <div>
      {availableFilters.map((filter) => (
        <FilterItem
          key={filter.name}
          filterName={filter.name}
          filterValues={filter.values}
          selectedValues={selectedFilters[filter.name]}
          updateSelectedFilters={updateSelectedFilters}
        />
      ))}
    </div>
  );
}

export default Filters;
