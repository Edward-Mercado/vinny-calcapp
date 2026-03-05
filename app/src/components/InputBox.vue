<template>
    <div class="bg-black h-[25%] rounded-2xl p-5 my-2">
       <h2 class="audiowide-regular text-3xl">
        {{ calcInput }}
       </h2>
    </div>
</template>

<script setup lang="ts">

defineProps({
    calcInput: {   
        type: String,
        required: true,
    }
})

</script>

<style scoped>

</style>