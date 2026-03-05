<template>
    <button class="h-10 w-[28%] border-2 border-slate-900 text-center text-2xl audiowide-regular bg-blue-600 m-[2%] rounded-2xl hover:bg-blue-800 btn">
        {{  op }}
    </button>
</template>

<script setup lang="ts">
defineProps({
    op: {
        type: String,
        required: true,
    }
})
</script>

<style scoped>

</style>