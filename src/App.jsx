import React, {useState} from 'react';
import Sheet from './Sheet.jsx'
import './index.css'



const numRows= 26
const numCols = 100


let initialData = []
for (let ri = 0; ri < numRows; ri++) {
 

    for (let  ci = 0; ci < numCols; ci++) {


      initialData.push({

        row: ri,
        col: ci,
        content: '',
        formula: '',
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