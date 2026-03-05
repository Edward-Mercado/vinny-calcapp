<template>
    <div class="mb-4 mt-0 bg-slate-500 w-full h-[7%] rounded-2xl p-1 px-5 audiowide-regular">
        {{ calcOutput }}
    </div>
</template>

<script setup lang="ts">
    defineProps({
        calcOutput: {
            type: String,
            required: true
        }
    })
</script>

<style scoped>

</style>