import { reactive, ref } from 'vue' 

export interface historyInput {
    input: string;
    output: string;
}

export const history = ref<historyInput[]>([])

export const ops: string[] =[" + ", " - ", " * ", " / ", " ^ ", "C", "CE", " = "]

export const numbers: string[] =["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",]

export const inputString = ref<string>("")
export const outputString = ref<string>("")