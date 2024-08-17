import React from "react";

function FilterItem({
  filterName,
  filterValues,
  selectedValues,
  updateSelectedFilters,
}) {
  const isArray = Array.isArray(selectedValues);

  return (
    <div>
      <h3>{filterName}</h3>
      <div>
        {filterValues.map((value) => (
          <button
            key={value}
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor:
                (isArray && selectedValues.includes(value)) ||
                selectedValues === value
                  ? "lightblue"
                  : "white",

              //   backgroundColor: selectedValues && selectedValues.includes(value) ? 'lightblue' : 'white'
            }}
            onClick={() => updateSelectedFilters(filterName, value)}
          >
            {value.toString()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterItem;
