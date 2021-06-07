import React, {useState} from 'react';
import Cell from './Cell.js'
import Sheet from './Sheet.jsx'
import './index.css'



const numRows= 10
const numCols = 30


let initialData = []
for (let ri = 0; ri < numRows; ri++) {
 

    for (let  ci = 0; ci < numCols; ci++) {


      initialData.push({

        row: ri,
        col: ci,
        content: '',
        isSelected: false

        })
    }
  }






function App() {

  let [data, setData] = useState(initialData)


  
  


  return (
    <>
    
    <Sheet numRows={numRows} numCols={numCols} data={data} setData={setData}/>
   
    </>
    
  );
}

export default App;