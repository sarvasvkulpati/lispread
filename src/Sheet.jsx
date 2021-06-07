import React from 'react';
import Row from './Row'
import './index.css'




function Sheet({numRows, numCols, data, setData}){

  

  let rows = []

  for (let ri = 0; ri < numRows; ri++) {
    

    rows.push(<Row key={`row-${ri}`} rowIdx={ri}  numCols={numCols} data={data} setData={setData}/>)
  }

  return(
    <div className="flex flex-col w-max">{rows}</div>
  )
}

export default Sheet