import { reactive, ref } from 'vue'
import { inputString } from './storage'
import { numbers } from './storage'
import { outputString } from './storage'

export function handleClick(buttonArg:string) {
    if(buttonArg === " = ") {
        calculate()
    } else if (buttonArg === "CE") {
        removeLast()
    } else if (buttonArg === "C") {
        clear()
    }
    else {
        inputString.value += buttonArg 
        console.log(inputString.value)
    }
}

function calculate() {
    let parsedList:(string | number)[] = parseInput()

    if(!passChecks(parsedList)) {
        outputString.value = "Invalid input."
    } else {
        parsedList = runExponents(parsedList)
        parsedList = runMultiDivide(parsedList)
        parsedList = runAddSubtract(parsedList)
        outputString.value = Number(parsedList[0]).toFixed(5).toString()
    }
}

function checkTwoScript(parsedList:(string | number)[]) {
    let outputBool:boolean = true
    parsedList.forEach((el:any) => {
        if(parsedList.indexOf(el) === parsedList.length - 1) {
            
        } else {
            if(typeof el === "string" && typeof parsedList[parsedList.indexOf(el)+1] === "string") {
                outputBool = false
            }
        }
    })
    return outputBool
}

function passChecks(parsedList:(string | number)[]) {
    const checkOne = typeof parsedList[0] === 'number' && typeof parsedList[parsedList.length - 1] === 'number'
    const checkTwo = checkTwoScript(parsedList)

    if(checkOne && checkTwo) {
        console.log('valid')
        return true
    } console.log('invalid')
    return false
}

function runExponents(parsedList:(string | number)[] ) {
    let thisStepComplete:boolean = false
    while(!thisStepComplete) {
        parsedList = parsedList.filter((el) => el !== "REMOVE")

        for(const el of parsedList) {
            if(el === "^") {
                let index:number = parsedList.indexOf(el)
                parsedList[index] = Number(parsedList[index-1]) ** Number(parsedList[index+1])
                parsedList[index-1] = "REMOVE"
                parsedList[index+1] = "REMOVE"
                break
            }
        }

        let noMoreOperands = true
        parsedList.forEach((el) => {
            if(el === "^") {
                noMoreOperands = false
            }
        })
        thisStepComplete = noMoreOperands
    }
    return parsedList
}

function runMultiDivide(parsedList:(string | number)[] ) {
    let thisStepComplete:boolean = false

    while(!thisStepComplete) {
        parsedList = parsedList.filter((el) => el !== "REMOVE")

        for(const el of parsedList) {
            
            if(el === "*" || el === "/") {
                let index:number = parsedList.indexOf(el)
                if(el === "*") {
                    parsedList[index] = Number(parsedList[index-1]) * Number(parsedList[index+1])
                    parsedList[index-1] = "REMOVE"
                    parsedList[index+1] = "REMOVE"
                } else {
                    parsedList[index] = Number(parsedList[index-1]) / Number(parsedList[index+1])
                    parsedList[index-1] = "REMOVE"
                    parsedList[index+1] = "REMOVE"
                }
                break
            }
        }

        let noMoreOperands = true
        parsedList.forEach((el) => {
            if(el === "*" || el === "/") {
                noMoreOperands = false
            }
        })
        thisStepComplete = noMoreOperands
    }

    return parsedList
}

function runAddSubtract(parsedList:(string | number)[] ) {
    let thisStepComplete:boolean = false

    while(!thisStepComplete) {
        parsedList = parsedList.filter((el) => el !== "REMOVE")

        for(const el of parsedList) {
            
            if(el === "+" || el === "-") {
                let index:number = parsedList.indexOf(el)
                if(el === "+") {
                    parsedList[index] = Number(parsedList[index-1]) + Number(parsedList[index+1])
                    parsedList[index-1] = "REMOVE"
                    parsedList[index+1] = "REMOVE"
                } else {
                    parsedList[index] = Number(parsedList[index-1]) - Number(parsedList[index+1])
                    parsedList[index-1] = "REMOVE"
                    parsedList[index+1] = "REMOVE"
                }
                break
            }
        }

        let noMoreOperands = true
        parsedList.forEach((el) => {
            if(el === "*" || el === "/") {
                noMoreOperands = false
            }
        })
        thisStepComplete = noMoreOperands
    }
    parsedList = parsedList.filter((el) => el !== "REMOVE")
    return parsedList
}

function parseInput() {
    let inputValue:string = inputString.value
    let inputsList:string[] = inputValue.split(" ")
    let parsedList:(string | number)[] = []
    inputsList.forEach((value) => {
        if(numbers.find(num => value[0] === num)) {
            parsedList.push(Number(value))
        } else {
            parsedList.push(value)
        }
    })
    return parsedList
}

function removeLast() {
    let inputValue:string = inputString.value

    if(inputValue[inputValue.length - 1] === " ") {
        inputValue = inputValue.slice(0, -3)
    } else {
        inputValue = inputValue.slice(0, -1)
    }

    inputString.value = inputValue
}

function add(number1:number, number2:number) {
    return number1 + number2
}

function clear() {
    let inputValue:string = inputString.value
    inputValue = ""
    outputString.value = ""

    inputString.value = inputValue
}