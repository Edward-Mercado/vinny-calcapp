<template>
    <button class="h-10 w-[28%] border-2 border-slate-900 text-center text-2xl audiowide-regular bg-blue-400 m-[2%] rounded-2xl hover:bg-blue-500 btn">
        {{ n }}
    </button>
</template>

<script setup lang="ts">
defineProps({
    n: {
        type: String,
        required: true,
    }
})



</script>

<style scoped>

</style>