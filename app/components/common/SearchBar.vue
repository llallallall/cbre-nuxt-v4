<template>
        <div class="w-full max-w-md">
                <UInput :model-value="keyword" @update:model-value="emit('update:keyword', $event)"
                        @keyup.enter="$emit('search')" icon="i-heroicons-magnifying-glass" placeholder="Search..."
                        class="w-full placeholder:tracking-widest rounded-none" color="primary" variant="outline" />
        </div>
</template>

<script setup lang="ts">
defineProps<{
        keyword: string;
}>();

const emit = defineEmits(['update:keyword', 'search']);

</script>
