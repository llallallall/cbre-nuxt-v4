<template>
    <div class="flex flex-col lg:flex-row min-h-screen bg-gray-50 pt-[8rem] font-calibre transition-all duration-300">
        <!-- Sidebar Navigation -->
        <aside
            class="w-full lg:w-64 bg-white border-r border-gray-200 lg:h-[calc(100vh-8rem)] lg:fixed lg:left-0 lg:overflow-y-auto z-30 transition-all duration-300">
            <div class="p-6">
                <h2 class="text-xl font-financier text-cbre-green mb-6 border-b pb-2 cursor-pointer" @click="navigateTo('/docs')">{{ $t('docs.title') }}</h2>
                <nav class="space-y-6">
                     <ContentNavigation v-slot="{ navigation }">
                        <div v-for="link in navigation" :key="link._path">
                             <div  class="mb-2 font-semibold text-gray-900 uppercase text-sm tracking-wider">
                                {{ link.title }}
                             </div>
                             <ul class="space-y-1 border-l-2 border-gray-100 ml-1">
                                <li v-for="child in link.children" :key="child._path">
                            <NuxtLink :to="child._path"
                                class="block px-4 py-2 text-sm text-gray-600 hover:text-cbre-green hover:bg-gray-50 rounded-r-md transition-colors"
                                active-class="text-cbre-green bg-cbre-green/5 border-l-2 border-cbre-green -ml-[2px] font-medium" >
                                {{ child.title }}
                            </NuxtLink>
                                </li>
                             </ul>
                        </div>
                     </ContentNavigation>
                </nav>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 lg:ml-64 p-8 lg:p-12 max-w-5xl">
            <article class="prose prose-slate max-w-none prose-headings:font-financier prose-headings:text-cbre-green prose-a:text-cbre-green hover:prose-a:text-cbre-accent">
                <ContentDoc>
                     <template #not-found>
                         <div class="text-center py-20">
                             <UIcon name="i-heroicons-document-magnifying-glass" class="w-16 h-16 text-gray-300 mb-4" />
                            <h1 class="text-3xl font-financier text-gray-400">Select a document from the menu</h1>
                            <p class="text-gray-500 mt-2">Browse the System and Operation manuals on the left.</p>
                         </div>
                    </template>
                 </ContentDoc>
            </article>
        </main>
    </div>
</template>

<script setup lang="ts">
// Docs layout built-in
</script>

<style>
/* Custom Prose Overrides for CBRE Brand */
.prose h1 {
    font-size: 2.25rem;
    margin-bottom: 2rem;
}
.prose h2 {
    margin-top: 2.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
}
</style>
