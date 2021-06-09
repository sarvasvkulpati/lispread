import React from 'react';
import Row from './Row'
import './index.css'
import {parseFormula} from './Parser.js'



function Sheet({numRows, numCols, data, setData}){





  let indexesToId = (row, col) => {
    let rowNum = Number(col) 
    let colLetter= String.fromCharCode(64 + Number(row))
    return colLetter + rowNum
  }

  let idToIndexes = (id) => {
    let colLetter = id[0]
    let col = colLetter.charCodeAt(0) - 64
    let row = Number(id[1] )
    return [row, col]
  }









  let updateDependencyGraph = (newInput, row, col) => {


    console.log('newInput', newInput)
    let prevData = data[row][col]
    console.log('prev', prevData)
    
    let {dependencies, result} = parseFormula(newInput)

    // don't let the cell refer to itself
    if (dependencies.includes(indexesToId(row, col))) {
      alert("can't refer to self")
      return
    }


    let dataCopy = [...data]

    //find dropped dependencies if any. All of these are cell IDs, e.g. A1, B3, C4
    if(prevData.content[0] == '=') {

      let {dependencies: oldDependencies} = parseFormula(prevData.content)
      

      let droppedDependencies = oldDependencies.filter((dependency) => {
        return !dependencies.includes(dependency)
      })


      droppedDependencies.forEach((id) => {
        let [droppedRow, droppedCol] = idToIndexes(id)
        

        let updateCell = dataCopy[row][col]

        updateCell.dependencyOf = updateCell.dependencyOf.filter((cellId) => cellId != indexesToId(row, col))

      })
      
    }
    

    //set dependencies
    for (dependency of dependencies) {
      let [ dependencyRow, dependencyCol] = idToIndexes(dependency)
      
      let dependencyCell = dataCopy[row][col]

      let id = indexesToId(row, col)

      if(dependencyCell.dependencyOf.indexOf(id) == -1) {
        dependencyCell.dependencyOf.push(id)
      }
    }
    
    dataCopy[row][col].content = newInput
    setData(dataCopy)
  }




  let rows = []

  for (let ri = 0; ri < numRows; ri++) {
    

    rows.push(
      <Row 
        key={`row-${ri}`} 
        row={ri}  
        numCols={numCols} 
        data={data[ri]} 
        commitData ={updateDependencyGraph}
        />)
  }

  return(
    <div className="flex flex-col w-max">{rows}</div>
  )
}

export default Sheet