
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
  
  export function parseFormula(content, data, row, col) {
    
  let determineContent = (text) => {
    
    if(text[0] == '=') {
      let {result} = parseFormula(text)
      return result
    } else {

     
      return text
    }
  }


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




        return determineContent(data[row][col].content)

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


