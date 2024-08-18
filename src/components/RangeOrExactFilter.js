

import React, { useState } from "react";

function RangeOrExactFilter({
  filterName,
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
      // Clear all related filter values when disabling
      updateSelectedFilters(`${filterName}_gte`, null);
      updateSelectedFilters(`${filterName}_lte`, null);
      updateSelectedFilters(`${filterName}_eq`, null);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    // Clear values of the other mode when switching
    if (newMode === "range") {
      updateSelectedFilters(`${filterName}_eq`, null);
    } else {
      updateSelectedFilters(`${filterName}_gte`, null);
      updateSelectedFilters(`${filterName}_lte`, null);
    }
  };

  return (
    <div>
      <h3>{filterName.replace(/_/g, " ").toUpperCase()}</h3>
      <button
        onClick={toggleEnable}
        style={{
          backgroundColor: isEnabled ? "lightblue" : "white",
          padding: "5px",
          margin: "5px",
        }}
      >
        {isEnabled ? "Disable Filter" : "Enable Filter"}
      </button>
      {isEnabled && (
        <div>
          <div>
            <button
              onClick={() => switchMode("range")}
              style={{
                backgroundColor: mode === "range" ? "lightblue" : "white",
                color: mode === "range" ? "black" : "grey",
                padding: "5px",
                margin: "5px",
              }}
            >
              Set Range
            </button>
            <button
              onClick={() => switchMode("exact")}
              style={{
                backgroundColor: mode === "exact" ? "lightblue" : "white",
                color: mode === "exact" ? "black" : "grey",
                padding: "5px",
                margin: "5px",
              }}
            >
              Set Exact Value
            </button>
          </div>
          {mode === "range" ? (
            <div>
              <input
                type="number"
                placeholder={`${filterName}_gte`}
                step="any"
                onChange={(e) => handleInputChange(e, `${filterName}_gte`)}
                style={{ marginRight: "5px" }}
              />
              <input
                type="number"
                placeholder={`${filterName}_lte`}
                step="any"
                onChange={(e) => handleInputChange(e, `${filterName}_lte`)}
                style={{ marginRight: "5px" }}
              />
            </div>
          ) : (
            <div>
              <input
                type="number"
                placeholder={`${filterName}_eq`}
                step="any"
                onChange={(e) => handleInputChange(e, `${filterName}_eq`)}
                style={{ marginRight: "5px" }}
              />
            </div>
          )}
          <div>
            <label>
              Min, Max: ({filterValues[0]}, {filterValues[1]})
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default RangeOrExactFilter;
