
import React, {useState, useEffect} from 'react'
import './index.css'



export default function Cell({rowIdx, colIdx, data, setData}) {

  let [inputValue, setInputValue] = useState('')
  let [isSelected, setIsSelected] = useState(false)
  let [content, setContent] = useState('')

  useEffect(() => {
    window.document.addEventListener('unselectAll', handleUnselectAll)
    window.document.addEventListener('keypress', handleKeyPress)
  })


  useEffect(() => {
    handleInputChange()
  }, [inputValue])


  useEffect(() => {

    let cellData = data.find((cell) => cell.row == rowIdx && cell.col == colIdx)
    console.log(cellData)
   
    setContent(determineContent(cellData.content))
  }, [data])
  
 

  let handleInputChange = () => {


    let idx = data.findIndex((cell)=> cell.row == rowIdx && cell.col == colIdx)
    let dataCopy = [...data]
    
    dataCopy[idx].content = inputValue

    
    setData(dataCopy)
    
  }


 



  let emitUnselectAllEvent = () => {
    window.document.dispatchEvent(new Event('unselectAll'))
  }


  let handleUnselectAll = () => {
      if (isSelected) {
      
        setIsSelected(false)
      }
  }





  let handleKeyPress = () => {
    if (event.key == 'Enter') {
     
      emitUnselectAllEvent()
    }
  }


  let updateDependencyGraph = (newInput, row, col) => {

    let prevData = data.find((cell)=> cell.row == row && cell.col == col)

    
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
        

        let updateCell = dataCopy.find((cell) => cell.row == droppedRow && cell.col == droppedCol)

        updateCell.dependencyOf = updateCell.dependencyOf.filter((cellId) => cellId != indexesToId(row, col))

      })
      
    }
    

    //set dependencies
    for (dependency of dependencies) {
      let [ dependencyRow, dependencyCol] = idToIndexes(dependency)
      
      let dependencyCell = dataCopy.find((cell) => cell.row == dependencyRow && cell.col == dependencyCol)

      let id = indexesToId(row, col)

      if(dependencyCell.dependencyOf.indexOf(id) == -1) {
        dependencyCell.dependencyOf.push(id)
      }
    }
    

    setData(dataCopy)
  }



  let ops = {
  '+' : (op1, op2) => Number(op1) + Number(op2),
  '-' : (op1, op2) => Number(op1) - Number(op2),
  '/' : (op1, op2) => Number(op1) / Number(op2),
  '*' : (op1, op2) => Number(op1) * Number(op2),
  '>' : (op1, op2) => Number(op1) > Number(op2),
  '<' : (op1, op2) => Number(op1) < Number(op2),
  '>=':(op1, op2) => Number(op1) >= Number(op2),
  '<=':(op1, op2) => Number(op1) >= Number(op2),
 
 
  }


  function parseFormula(content) {


  try {


  let tokens = content.replaceAll('(', ' ( ').replaceAll(')', ' ) ').split(/  */)

  tokens.shift() //get rid of the =


 

  let tokens_to_ast = (tokens) => {

    let token = tokens.shift()

    if (token == '(') {
      let ast = []

      while (tokens[0] && tokens[0] != ')' ) {
        ast.push(tokens_to_ast(tokens))
      }
      tokens.shift() //get rid of )
      return ast

    } else if (token == ')') {
      throw "there shouldn't be a ) here"
    } else {
      return token
    }
  }




  let ast = tokens_to_ast(tokens)

 

  let dependencies = []

  let evaluate = (x) => {


    // console.log('evaluating', x)

    // if it's a cellId
    if (typeof (x) == 'string' && x.match(/[A-Z][0-9]/)) {


      dependencies.push(x)




      return determineContent(getCellAt(...idToIndexes(x)).content)

    }
    // it's a number
    else if (!isNaN(x)) {



      return x
    }

    else if (typeof (x) == 'string' && ops[x]) {



      return ops[x]
    }

    // it's a procedure

    else {

      let proc = evaluate(x[0])
      let args = x.slice(1).map((arg) => evaluate(arg))

      return args.reduce(proc)
    }
  }




  return {result: evaluate(ast), dependencies: dependencies}

  } catch {
    return {content: "ERROR", dependencies: []}
  }


}





let getCellAt = (row, col) => {
  return data.find((cell) => cell.row == row && cell.col == col)
}




 


  

  let onClick = () => {
    
    
    emitUnselectAllEvent()
    setIsSelected(true)
  }



  let determineContent = (text) => {

    
    

    if(text[0] == '=') {
      
      let {result} = parseFormula(text)

      
      return result
    } else {
      return text
    }


  
  
  }



  let indexesToId= (row, col) => {
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



  if(rowIdx == 0 && colIdx != 0) {
    let letters = ' ABCDEFGHIJKLMNOPQRSTUVWKYZ'.split('')

    return(
      <span 
        className="min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 ">
        {letters[colIdx]}
      </span>)
  }


  if(colIdx == 0 && rowIdx !=0){
    return(
      <span 
      className="min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 ">
        {rowIdx}
      </span>)
  }



  

  return(
    <>
      {isSelected &&  
      <input 
        className = "bg-red-200 min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 "
        type='text' 
        value = {inputValue}
        onChange={(e) => setInputValue(e.target.value)}/>}

      {!isSelected && 
      <span 
        className="min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 "
        onClick={onClick}>{content}</span>}
    </>
  )

}


// determineContent(cellData.content)