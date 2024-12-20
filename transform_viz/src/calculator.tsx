type VarDict = { [key: string]: number };

class Expression {
    eval(var_dict: VarDict): number {
        return 0;
    }
    
    cull() : Expression{
        return this;
    }
}

class Variable extends Expression {
    name: string;

    constructor(varname: string) {
        super();
        this.name = varname;
    }

    eval(var_dict: VarDict): number {
        return var_dict[this.name];
    }
}

class UnaryExpression extends Expression {
    op: (x: number) => number;
    inside: Expression;

    constructor(op: (x: number) => number, internal: Expression) {
        super();
        this.op = op;
        this.inside = internal;
    }

    eval(var_dict: VarDict): number {
        return this.op(this.inside.eval(var_dict));
    }

    cull():Expression{
        this.inside = this.inside.cull();
        if (this.inside instanceof Constant){
            return new Constant(this.op(this.inside.eval({})));
        }
        return this;
    }
}

class BinaryExpression extends Expression {
    op: (left: number, right: number) => number;
    left: Expression;
    right: Expression;

    constructor(op: (left: number, right: number) => number, left: Expression, right: Expression) {
        super();
        this.op = op;
        this.left = left;
        this.right = right;
    }

    eval(var_dict: VarDict): number {
        return this.op(this.left.eval(var_dict), this.right.eval(var_dict));
    }

    cull(): Expression{
        this.left = this.left.cull();
        this.right = this.right.cull();
        if ((this.left instanceof Constant) && (this.right instanceof Constant)){
            return new Constant(this.op(this.left.eval({}),this.right.eval({})));
        }
        return this;
    }
}

class Constant extends Expression {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    eval(var_dict: VarDict): number {
        return this.value;
    }

}

//5*2 + 3
//-sin(x)
//2*-4
//-4+5
//5+-4
//we wanna determine what the least precedence operator is, take it, and then create a new expression

//pseudo code:
//take expression and do some preparsing:
//  if we see "-" we look before hand until we see a "(" or ")" to see if the previous character is a valid binary operator or if there's nothing there
//  in either case we replace "-" with "neg", and wrap the following term with parantheses

//look for any binary operators that aren't wrapped in ()
//once we find one, we update the index of the lowest priority operator
//once we find the lowest priority operator, separate expression into two and call recurively
//if those aren't there, then we must be dealing with a unary
//so we need to go from the left, and read in characters until we have a valid unary operator, followed by "("
//once that occurs, we just recursively call parseExpression


function precedence(char : String) : number{
    switch(char){
    case "+":
        return 0
    case "-":
        return 5;
    case "/":
    case "*":
        return 1;
    case "^":
        return 2;
    default:
        throw("Invalid precedence input");
        return -100;
    }
}

function isBinaryOp(char:string):boolean{
    var list = ["+","-","/","*","^"];
    for (let i = 0; i < list.length; i++){
        if (list[i] == char){
            return true;
        }
    }
    return false;
}

function isAlpha(str:string):boolean{
    return /^[a-zA-Z]$/.test(str);
}

function replaceConstants(input: string): string {
    const constants: { [key: string]: number } = {
        e: Math.E, // Euler's number
        pi: Math.PI, // Pi
        phi: (1 + Math.sqrt(5)) / 2, // Golden ratio
    };

    // Replace constants only when they are not adjacent to other letters
    return input.replace(/\b(e|pi|phi)\b/g, (match) => {
        return constants[match].toString();
    });
}

function preprocess(expression:string):string{
        // Remove all spaces
        let noSpaces = expression.replace(/\s+/g, '');
    
        // Insert a * between numbers and letters
        let result = noSpaces.replace(/(\d)([a-zA-Z])|([a-zA-Z])(\d)/g, (match, num1, letter1, letter2, num2) => {
            return num1 ? `${num1}*${letter1}` : `${letter2}*${num2}`;
        });

        result = result.replace("sin^2","sinsq");
        result = result.replace("cos^2","cossq");
        result = result.replace("sin^-1","asin");
        result = result.replace("cos^-1","acos");
        result = result.replace("tan^-1","atan"); 

        let newexpr = ""

        // result = result.replace("-","+-");

        for (let i = 0; i < result.length; i++){
            if (result[i] == "-"){
                if (i == 0 || isBinaryOp(result[i-1]) || result[i-1] == "("){
                    newexpr+="0";
                }
                else{
                    newexpr+="+0"
                }
                newexpr+="-";
            }
            else{
                newexpr += result[i];
            }
        }

        return replaceConstants(newexpr);
}


function wrapped(expression: String, index: number) : boolean{
    let leftCount = 0;
    let rightCount = 0;

    for (let i = index; i>=0; i--){
        if (expression[i] == "("){
            leftCount++
        }
        else if (expression[i] == ")"){
            rightCount++;
        }
    }

    return (leftCount - rightCount) != 0;
}

function binaryToFunction(char: String) : (left: number, right: number) => number{
    switch(char){
        case "+":
            return (x,y)=>x+y;
        case "-":
            return (x,y)=>x-y;
        case "/":
            return (x,y)=>x/y;
        case "*":
            return (x,y)=>x*y;
        case "^":
            return (x,y)=>Math.pow(x,y);
        default:
            throw("Invalid input to binaryToFunction:"+char);
    }
}


function unaryToFunction(operation: string): (x: number) => number {
    switch (operation.toLowerCase()) {
        // Basic Functions
        case "sqrt":
            return (x) => Math.sqrt(x); // Square root
        case "cbrt":
            return (x) => Math.cbrt(x); // Cube root
        case "abs":
            return (x) => Math.abs(x); // Absolute value
        case "ceil":
            return (x) => Math.ceil(x); // Round up
        case "floor":
            return (x) => Math.floor(x); // Round down
        case "round":
            return (x) => Math.round(x); // Round to nearest integer
        case "sign":
            return (x) => Math.sign(x); // Sign of x: -1, 0, or 1
        // Trigonometric Functions
        case "sin":
            return (x) => Math.sin(x); // Sine
        case "cos":
            return (x) => Math.cos(x); // Cosine
        case "tan":
            return (x) => Math.tan(x); // Tangent
        case "csc":
            return (x) => 1/Math.sin(x);
        case "sec":
            return (x) => 1/Math.cos(x);
        case "cot":
            return (x) => 1/Math.tan(x);
        case "asin":
            return (x) => Math.asin(x); // Arcsine
        case "acos":
            return (x) => Math.acos(x); // Arccosine
        case "atan":
            return (x) => Math.atan(x); // Arctangent
        case "sinh":
            return (x) => Math.sinh(x); // Hyperbolic sine
        case "cosh":
            return (x) => Math.cosh(x); // Hyperbolic cosine
        case "tanh":
            return (x) => Math.tanh(x); // Hyperbolic tangent
        case "asinh":
            return (x) => Math.asinh(x); // Inverse hyperbolic sine
        case "acosh":
            return (x) => Math.acosh(x); // Inverse hyperbolic cosine
        case "atanh":
            return (x) => Math.atanh(x); // Inverse hyperbolic tangent
        
        case "sinsq":
            return (x) => Math.sin(x)*Math.sin(x);
        case "cossq":
            return (x) => Math.cos(x)*Math.cos(x);
        // Logarithmic and Exponential Functions
        case "log":
            return (x) => Math.log(x); // Natural logarithm (base e)
        case "log10":
            return (x) => Math.log10(x); // Base-10 logarithm
        case "log2":
            return (x) => Math.log2(x); // Base-2 logarithm
        case "exp":
            return (x) => Math.exp(x); // e^x
        case "pow10":
            return (x) => Math.pow(10, x); // 10^x

        default:
            throw new Error(`Invalid input to unaryToFunction: '${operation}' is not a recognized operation.`);
    }  
} 

function parseExpression(raw_expression: string) : Expression{
    let lowest_precedence:number= -1;
    for (let i = 0; i < raw_expression.length; i++){
        if (isBinaryOp(raw_expression[i])){
            if (!wrapped(raw_expression,i)){
                if (lowest_precedence == -1){
                    lowest_precedence = i;
                }
                else if (precedence(raw_expression[i]) < precedence(raw_expression[lowest_precedence])){
                    lowest_precedence = i;
                }
            }
        }
    }

    if (lowest_precedence != -1){
        return new BinaryExpression(
            binaryToFunction(raw_expression[lowest_precedence]), 
            parseExpression(raw_expression.slice(0,lowest_precedence)),
            parseExpression(raw_expression.slice(lowest_precedence+1,raw_expression.length))
        );
    }

    let buffer="";




    for (let i = 0; i < raw_expression.length; i++){
        if (raw_expression[i] == "("){
            break;
        }
        if (raw_expression[i] == ")"){
            throw("Invalid expression.: "+raw_expression);
        }
        buffer += raw_expression[i];
    }

    if (buffer.length != raw_expression.length){
        //unary expression

        //in case it is just wrapped in parantheses
        if (buffer.length == 0){
            return parseExpression(raw_expression.slice(1,raw_expression.length-1));
        }
        return new UnaryExpression(unaryToFunction(buffer),parseExpression(raw_expression.slice(buffer.length,raw_expression.length)));
    }

    else{
        if (buffer.length == 0){
            throw("Invalid expression:"+raw_expression+".");
        }
        if (!isNaN(Number(buffer))){
            return new Constant(Number(buffer));
        }

        else if (buffer.length == 1){
            if (isAlpha(buffer)){
                return new Variable(buffer);
            }
            throw("Invalid expression:"+buffer);
        }

        else{
            throw ("Invalid expression:"+buffer);
        }
}
}

function processExpression(raw_string : string):Expression{
    return parseExpression(preprocess(raw_string)).cull();
}



export {
    Expression,
    processExpression
}