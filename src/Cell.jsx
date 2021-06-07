
import React, {useState, useEffect} from 'react'
import './index.css'
export default function Cell({rowIdx, colIdx, data, setData}) {



let [inputValue, setInputValue] = useState('')

let [isSelected, setIsSelected] = useState(false)

useEffect(() => {
  window.document.addEventListener('unselectAll',
      handleUnselectAll)

  window.document.addEventListener('keypress', handleKeyPress)
})


useEffect(() => {

  handleInputChange()

}, [inputValue])


let handleKeyPress = () => {
  if (event.key == 'Enter') {
    emitUnselectAllEvent()

  }
}


let handleInputChange = () => {
let idx = data.findIndex((cell)=> cell.row == rowIdx && cell.col == colIdx)


data[idx].content = inputValue



console.log(inputValue)
setData(data)
}

let emitUnselectAllEvent = () => {
  window.document.dispatchEvent(new Event('unselectAll'))
}


let handleUnselectAll = () => {
    if (isSelected) {
      setIsSelected(false)
    }
}




let onChange = () => {
  

setInputValue(event.target.value)




  
}


let onClick = () => {


emitUnselectAllEvent()
setIsSelected(true)
}







if(rowIdx == 0 && colIdx != 0) {
  let letters = ' ABCDEFGHIJKLMNOPQRSTUVWKYZ'.split('')



  return(<span className="min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 ">{letters[colIdx]}</span>)
}

if(colIdx == 0 && rowIdx !=0){
  return(<span className="min-w-32 w-32 min-h-8 h-8 box-border relative inline-block border border-gray-300 px-1 ">{rowIdx}</span>)
}




let cellData = data.find((cell) => (cell.row == rowIdx && cell.col == colIdx))





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
      onClick={onClick}>{cellData.content}</span>}
  </>
)



}