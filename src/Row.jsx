import React from 'react'
import Cell from './Cell.jsx'
import './index.css'


const Row = ({rowIdx, colIdx, numCols, data, setData}) => {
  const cells = []
  
  

  for( let colIdx = 0; colIdx<  numCols; colIdx++){



   

    cells.push(
      <Cell 
        key={`${rowIdx}-${colIdx}`} 
        rowIdx = {rowIdx} 
        colIdx={colIdx} 
        data={data}
        setData={setData}/>)
  }

  return <div className="flex flex-row flex-nowrap">{cells}</div>
}

export default Row
