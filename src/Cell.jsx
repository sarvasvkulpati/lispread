
import React, {useState, useEffect} from 'react'
import './index.css'
import {parseFormula} from './Parser.js'


function Cell({row, col, data, commitData}) {

  let [inputValue, setInputValue] = useState('')
  let [isSelected, setIsSelected] = useState(false)
  

  useEffect(() => {
    window.document.addEventListener('unselectAll', handleUnselectAll)
    window.document.addEventListener('keypress', handleKeyPress)

    return () => {
       window.document.removeEventListener('unselectAll',handleUnselectAll)
      window.document.removeEventListener('keypress', handleKeyPress)
    }
  })





  


  let emitUnselectAllEvent = () => {
    window.document.dispatchEvent(new Event('unselectAll'))
  }


  let handleUnselectAll = () => {
      if (isSelected) {
        commitData(inputValue, row, col)
        setIsSelected(false)
      }
  }


  let handleKeyPress = () => {
    if (event.key == 'Enter') {

      emitUnselectAllEvent()
      

      
    }
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




  if(row == 0 && col != 0) {
    let letters = ' ABCDEFGHIJKLMNOPQRSTUVWKYZ'.split('')

    return(
      <span 
        className="min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 ">
        {letters[col]}
      </span>)
  }


  if(col == 0 && row !=0){
    return(
      <span 
      className="min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 ">
        {row}
      </span>)
  }



  


  let result = determineContent(data.content)
  
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
        onClick={onClick}>{result}</span>}
    </>
  )

}


export default React.memo(Cell)