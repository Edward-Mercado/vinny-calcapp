<template>
    <div class="bg-slate-400 border-4 border-black w-[40%] h-[90%] mx-auto my-[2.5%] rounded-4xl p-4">
    <h1 class="text-center text-2xl text-black audiowide-title"> GAOLCULATOR </h1>
    <InputBox :calcInput="inputString"></InputBox>
    <OutputBox :calcOutput="outputString"></OutputBox>
    <div class="h-50% w-full p-0.5 justify-center flex flex-wrap">
        <NumberButton v-for="n in numbers" :n="n" @click="handleClick(n)"> </NumberButton>
        <OperationButton v-for="op in ops" :op="op" @click="handleClick(op)"></OperationButton>
    </div>
    
    </div>
</template>

<script setup lang="ts">
import InputBox from '@/components/InputBox.vue'
import OutputBox from '@/components/OutputBox.vue';
import NumberButton from '../components/NumberButton.vue'
import OperationButton from '../components/OperationButton.vue';

import { history } from '../storage'
import { historyInput } from '../storage';
import { ops } from '../storage';
import { numbers } from '../storage'
import { inputString } from '../storage';
import { outputString } from '../storage'

import { handleClick } from '../functions'

</script>

<style scoped>

</style>