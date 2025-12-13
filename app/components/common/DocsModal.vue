<template>
    <CommonModal v-model="isOpen" fullscreen>
        <div class="flex flex-col h-full font-calibre overflow-hidden bg-gray-50">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10 box-border h-[4rem] flex-none">
                <h2 class="cbre-text-display-3 flex items-center gap-2">
                    <UIcon name="i-heroicons-book-open" class="w-6 h-6" />
                    {{ $t('docs.title') }}
                </h2>
                <!-- <UButton variant="ghost" icon="i-heroicons-x-mark" size="xl" @click="isOpen = false" /> -->
            </div>

            <!-- Body -->
            <div class="flex flex-1 overflow-hidden min-h-0">
                <!-- Sidebar -->
                <aside class="w-100 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block flex-none">
                    <nav class="p-4 space-y-6">
                         <div v-for="link in navigation" :key="link.title">
                             <div class="mb-2 font-semibold text-gray-900 uppercase tracking-wider px-2">
                                {{ link.title }}
                             </div>
                             <ul class="space-y-1 border-l-2 border-gray-100 ml-1">
                                <li v-for="child in link.children" :key="child._path">
                                    <button 
                                        @click="loadContent(child._path)"
                                        class="w-full text-left block px-4 py-2  rounded-r-md transition-colors"
                                        :class="currentPath === child._path ? 'text-cbre-green bg-cbre-green/5 border-l-2 border-cbre-green -ml-[2px] font-medium' : 'text-gray-600 hover:text-cbre-green hover:bg-gray-50'"
                                    >
                                        {{ child.title }}
                                    </button>
                                </li>
                             </ul>
                        </div>
                    </nav>
                </aside>

                <!-- Main Content -->
                <main class="flex-1 overflow-y-auto p-8 lg:p-12 bg-white relative">
                    <div v-if="pending" class="absolute inset-0 flex justify-center items-center bg-white/50 z-10">
                         <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                    
                    <div v-if="error" class="text-center py-20">
                        <p class="text-red-500">Failed to load content.</p>
                        <p class="text-xs text-gray-400">{{ error }}</p>
                    </div>

                    <article v-else class="prose prose-slate max-w-4xl mx-auto prose-headings:font-financier prose-headings:text-cbre-green prose-a:text-cbre-green hover:prose-a:text-cbre-accent pb-20">
                        <ContentRenderer v-if="data" :value="data" />
                         <div v-else-if="!pending" class="text-center py-20">
                             <UIcon name="i-heroicons-document-magnifying-glass" class="w-16 h-16 text-gray-300 mb-4" />
                            <h1 class="text-3xl font-financier text-gray-400">Select a document</h1>
                         </div>
                    </article>
                </main>
            </div>
        </div>
    </CommonModal>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const { locale } = useI18n();
const uiStore = useUiStore();

// Sync with store state
const isOpen = computed({
    get: () => uiStore.showDocsModal,
    set: (value) => uiStore.toggleDocsModal(value)
});

// Dynamic default path based on locale
const currentPath = ref<string>(`/${locale.value}/1.system/1.source-code`); 

// Watch locale change to redirect home
watch(locale, (newVal) => {
    currentPath.value = `/${newVal}/1.system/1.source-code`;
});

// 1. Fetch Navigation (All Content)
const { data: navItems } = await useAsyncData('docs-navigation', () => queryCollection('content').all());

interface NavGroup {
    title: string;
    children: { title: string; _path: string }[];
}

// Group by category (system vs operation)
const navigation = computed<NavGroup[]>(() => {
    if (!navItems.value) return [];
    
    // Simple grouping based on folder name
    const grouped: Record<string, NavGroup> = {};
    
    // Explicitly cast item to any to avoid implicit any errors if type is not inferred
    const items = navItems.value as any[];
    const currentLocalePrefix = `/${locale.value}/`; // e.g. "/en/" or "/ko/"
    
    items.forEach((item) => {
        // Extract basic info
        const path = item.path as string;
        if (!path || !path.startsWith(currentLocalePrefix)) return;

        const parts = path.split('/').filter(Boolean);
        // parts structure: [locale, category, filename] e.g. ['en', '1.system', '1.source-code']
        
        if (parts.length < 3) return; // Skip root files inside locale folder
        
        const category = parts[1]; 
        if (!category) return; // Strict null check for TS
        
        let group = grouped[category];
        if (!group) {
            group = {
                title: category.replace(/^\d+\./, '').toUpperCase(), // "SYSTEM", "OPERATION"
                children: []
            };
            grouped[category] = group;
        }
        
        group.children.push({
            title: item.title,
            _path: item.path
        });
    });

    // Sort categories
    return Object.keys(grouped).sort().map(key => grouped[key]!);
});

// 2. Fetch Content (Dynamic)
const { data, pending, error } = await useAsyncData(
    () => `docs-${currentPath.value}`, 
    () => queryCollection('content').path(currentPath.value).first(), 
    {
        watch: [currentPath]
    }
);

const loadContent = (path: string) => {
    currentPath.value = path;
}
</script>

<style scoped>
/* Custom Prose Overrides */
:deep(.prose h1) {
    font-size: 2.25rem;
    margin-bottom: 2rem;
}
:deep(.prose h2) {
    margin-top: 2.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
}
</style>
