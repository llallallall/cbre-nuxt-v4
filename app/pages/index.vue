<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

const quickLinks = [
    {
        title: 'Interactive Map',
        description: 'View properties on a map with clustering and filtering.',
        icon: 'i-heroicons-map',
        to: '/map', // Placeholder route
        color: 'text-cbre-green-500'
    },
    {
        title: 'Property List',
        description: 'Browse and search properties in a list view.',
        icon: 'i-heroicons-list-bullet',
        to: '/properties', // Placeholder route
        color: 'text-cbre-green-500'
    },
    {
        title: 'Admin Panel',
        description: 'Manage properties and system settings.',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/admin',
        color: 'text-gray-500'
    }
]
</script>

<template>
    <div class="space-y-12 py-12">
        <!-- Hero Section -->
        <section class="text-center space-y-4">
            <h1 class="text-5xl font-serif text-cbre-green-500">
                샷다 mouse
            </h1>
            <h1 class="text-5xl font-serif text-cbre-green-500">
                말이 씨가되
            </h1>
            <h1 class="text-5xl font-serif text-cbre-green-500">
                CBRE Property Management System
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
                Next-generation platform for visualizing and managing real estate properties with precision and ease.
            </p>
            <div class="pt-4">
                <UButton to="/map" size="xl" color="primary" variant="solid" label="Explore Map" icon="i-heroicons-map"
                    class="font-sans" />
            </div>
        </section>

        <!-- Quick Links Grid -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <UCard v-for="link in quickLinks" :key="link.title"
                class="hover:shadow-lg transition-shadow duration-300 rounded-none">
                <template #header>
                    <div class="flex items-center gap-3">
                        <UIcon :name="link.icon" class="w-8 h-8" :class="link.color" />
                        <h3 class="text-xl font-serif text-cbre-green-500">
                            {{ link.title }}
                        </h3>
                    </div>
                </template>

                <p class="text-gray-600 font-sans">
                    {{ link.description }}
                </p>

                <template #footer>
                    <UButton :to="link.to" variant="ghost" color="primary" label="Access"
                        trailing-icon="i-heroicons-arrow-right" class="p-0 hover:bg-transparent font-sans" />
                </template>
            </UCard>
        </section>

        <!-- Recent Activity Placeholder -->
        <section class="max-w-6xl mx-auto px-4 pt-8 border-t border-gray-200">
            <h2 class="text-2xl font-serif text-cbre-green-500 mb-6">
                Recent Activity
            </h2>
            <div class="bg-gray-50 p-8 text-center text-gray-500 font-sans">
                <UIcon name="i-heroicons-clock" class="w-12 h-12 mb-2 mx-auto text-gray-300" />
                <p>No recent activity found.</p>
            </div>
        </section>
    </div>
</template>
