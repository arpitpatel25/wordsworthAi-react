// import React, { useState } from 'react';

// function RangeOrExactFilter({ filterName, filterValues, updateSelectedFilters }) {
//   const [mode, setMode] = useState('range'); // 'range' or 'exact'

//   const handleInputChange = (e, fieldName) => {
//     const { value } = e.target;
//     const floatValue = parseFloat(value);
//     const min = filterValues[0];
//     const max = filterValues[1];

//     if (floatValue < min || floatValue > max) {
//       alert(`Value must be between ${min} and ${max}`);
//     } else {
//       updateSelectedFilters(fieldName, floatValue);
//     }
//   };

//   return (
//     <div>
//       <h3>{filterName.replace(/_/g, ' ').toUpperCase()}</h3>
//       <div>
//         <button onClick={() => setMode('range')}>Set Range</button>
//         <button onClick={() => setMode('exact')}>Set Exact Value</button>
//       </div>
//       {mode === 'range' ? (
//         <div>
//           <label>Min: {filterValues[0]}</label>
//           <input
//             type="number"
//             placeholder={`${filterName}_gte`}
//             min={filterValues[0]}
//             max={filterValues[1]}
//             step="any"
//             onChange={(e) => handleInputChange(e, `${filterName}_gte`)}
//           />
//           <label>Max: {filterValues[1]}</label>
//           <input
//             type="number"
//             placeholder={`${filterName}_lte`}
//             min={filterValues[0]}
//             max={filterValues[1]}
//             step="any"
//             onChange={(e) => handleInputChange(e, `${filterName}_lte`)}
//           />
//         </div>
//       ) : (
//         <div>
//           <label>Min: {filterValues[0]}</label>
//           <input
//             type="number"
//             placeholder={`${filterName}_eq`}
//             min={filterValues[0]}
//             max={filterValues[1]}
//             step="any"
//             onChange={(e) => handleInputChange(e, `${filterName}_eq`)}
//           />
//           <label>Max: {filterValues[1]}</label>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RangeOrExactFilter;

import React, { useState } from 'react';

function RangeOrExactFilter({ filterName, filterValues, updateSelectedFilters }) {
  const [mode, setMode] = useState('range'); // 'range' or 'exact'
  const [isEnabled, setIsEnabled] = useState(false);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    const floatValue = parseFloat(value);
    const min = filterValues[0];
    const max = filterValues[1];

    if (floatValue < min || floatValue > max) {
      alert(`Value must be between ${min} and ${max}`);
    } else {
      updateSelectedFilters(fieldName, floatValue);
    }
  };

  const toggleEnable = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      updateSelectedFilters(filterName, null); // Clear filter values when disabling
    }
  };

  return (
    <div>
      <h3>{filterName.replace(/_/g, ' ').toUpperCase()}</h3>
      <button 
        onClick={toggleEnable}
        style={{
          backgroundColor: isEnabled ? 'lightblue' : 'white',
          padding: '5px',
          margin: '5px',
        }}
      >
        {isEnabled ? 'Disable' : 'Enable'}
      </button>
      {isEnabled && (
        <div>
          <div>
            <button 
              onClick={() => setMode('range')}
              style={{
                backgroundColor: mode === 'range' ? 'lightblue' : 'white',
                color: mode === 'range' ? 'black' : 'grey',
                padding: '5px',
                margin: '5px',
              }}
            >
              Set Range
            </button>
            <button 
              onClick={() => setMode('exact')}
              style={{
                backgroundColor: mode === 'exact' ? 'lightblue' : 'white',
                color: mode === 'exact' ? 'black' : 'grey',
                padding: '5px',
                margin: '5px',
              }}
            >
              Set Exact Value
            </button>
          </div>
          {mode === 'range' ? (
            <div>
               <input
                type="number"
                placeholder={`${filterName}_gte`}
                min={filterValues[0]}
                max={filterValues[1]}
                step="any"
                onChange={(e) => handleInputChange(e, `${filterName}_gte`)}
                style={{ marginRight: '5px' }}
              />
                <input
                type="number"
                placeholder={`${filterName}_lte`}
                min={filterValues[0]}
                max={filterValues[1]}
                step="any"
                onChange={(e) => handleInputChange(e, `${filterName}_lte`)}
                style={{ marginRight: '5px' }}
              />
            </div>
          ) : (
            <div>
              <input
                type="number"
                placeholder={`${filterName}_eq`}
                min={filterValues[0]}
                max={filterValues[1]}
                step="any"
                onChange={(e) => handleInputChange(e, `${filterName}_eq`)}
                style={{ marginRight: '5px' }}
              />
            </div>
          )}
          <div>
            <label>Min, Max: ({filterValues[0]}, {filterValues[1]})</label>
          </div>
        </div>
      )}
    </div>
  );
}

export default RangeOrExactFilter;


