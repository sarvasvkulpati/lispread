import React from 'react';
import Row from './Row'
import './index.css'
import {parseFormula} from './Parser.js'



function Sheet({numRows, numCols, data, setData}){





  let indexesToId = (row, col) => {
    let rowNum = Number(row) 
    
    let colLetter= String.fromCharCode(64 + Number(col))
    return colLetter + rowNum
  }

  let idToIndexes = (id) => {
    let colLetter = id[0]
    let col = colLetter.charCodeAt(0) - 64
    let row = Number(id[1] )
    return [row, col]
  }


  let getDependentCells = (cellData)  => {
    
    let dependentCells = []
    let helper = (cellData) => {

      cellData.dependencyOf.forEach((cellId) => {

        dependentCells.push(cellId)
        let [dependentRow, dependentCol] = idToIndexes(cellId)
        let newCell = data[dependentRow][dependentCol]

        helper(newCell)
      })
    }

    helper(cellData)
    return dependentCells
  }


  let updateDependencyGraph = (newInput, row, col) => {

    console.log(data)

    let dataCopy = [...data]
    let prevData = dataCopy[row][col]
    let isFormula = (newInput[0] == '=')

    if(isFormula) {

      let {dependencies, result} = parseFormula(newInput, data)


      // don't let the cell refer to itself
      if (dependencies.includes(indexesToId(row, col))) {
        alert("can't refer to self")
        return
      }



      //find dropped dependencies if any and remove the cells id from them. All of these are cell IDs, e.g. A1, B3, C4
      if(prevData.content[0] == '=') {
      
        let {dependencies: oldDependencies} = parseFormula(prevData.formula, data)
        let droppedDependencies = oldDependencies.filter((dependency) => {

          return !dependencies.includes(dependency)
        })

        droppedDependencies.forEach((id) => {

          let [droppedRow, droppedCol] = idToIndexes(id)
          let updateCell = dataCopy[droppedRow][droppedCol]
          updateCell.dependencyOf = updateCell.dependencyOf.filter((cellId) => cellId != indexesToId(row, col))
        })
      }
      


      //set dependencies
      for (let dependency of dependencies) {

        let [ dependencyRow, dependencyCol] = idToIndexes(dependency)
        let dependencyCell = dataCopy[dependencyRow][dependencyCol]
        let id = indexesToId(row, col)

        if(dependencyCell.dependencyOf.indexOf(id) == -1) {
          
          dependencyCell.dependencyOf.push(id)
        }
      }

    

      dataCopy[row][col].formula = newInput
      dataCopy[row][col].content = result 
    } else {

      dataCopy[row][col].content = newInput
    }


    //update dependent cells
    let dependentCells = getDependentCells(dataCopy[row][col])
    dependentCells.forEach((dependentCellId) => {
    
      let [dependentRow, dependentCol] = idToIndexes(dependentCellId)

     
      let {result: dependentResult} = parseFormula(dataCopy[dependentRow][dependentCol].formula, dataCopy)

      console.log(dependentCellId, 'had the result', dependentResult)
      dataCopy[dependentRow][dependentCol].content = dependentResult
    })
    
     
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