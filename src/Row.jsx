import React from 'react'
import Cell from './Cell.jsx'
import './index.css'


const Row = ({row, col, numCols, data, commitData}) => {
  const cells = []
  
  

  for( let col = 0; col<  numCols; col++){



    

    cells.push(
      <Cell 
        key={`${row}-${col}`} 
        row = {row} 
        col={col} 
        data={data[col]}
   
       commitData={commitData}/>)
  }

  return <div className="flex flex-row flex-nowrap">{cells}</div>
}

// export default React.memo(Row, (prevProps, newProps) => {console.log(prevProps.data, newProps.data, prevProps.data == newProps.data);return prevProps.data == newProps.data})

export default Row