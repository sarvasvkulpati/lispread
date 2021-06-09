import React, {useState} from 'react';
import Sheet from './Sheet.jsx'
import './index.css'



const numRows= 100
const numCols = 27

let initialData = []
for (let ri = 0; ri < numRows; ri++) {

    let row = []
 

    for (let  ci = 0; ci < numCols; ci++) {


      row.push({

        row: ri,
        col: ci,
        content: '',
        formula: '',
        isSelected: false

        })
    }

    initialData.push(row)
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