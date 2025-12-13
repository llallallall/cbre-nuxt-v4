<template>
    <nav class="sticky top-[9rem] hidden lg:block w-64 pr-8">
        <ul class="space-y-6 border-l-2 border-gray-200">
            <li v-for="section in sections" :key="section.id" class="relative pl-6">
                <!-- Active Indicator Line -->
                <div v-show="activeSection === section.id"
                    class="absolute left-[-2px] top-0 h-full w-[2px] bg-cbre-green transition-all duration-300">
                </div>

                <a :href="`#${section.id}`" @click.prevent="scrollTo(section.id)"
                    class="block text-base font-calibre transition-colors duration-200 cursor-pointer py-1"
                    :class="activeSection === section.id ? 'text-cbre-green font-bold' : 'text-cbre-slate hover:text-cbre-green/70'">
                    {{ $t(section.labelKey) }}
                </a>
            </li>
        </ul>

        <!-- Design Element: Download PDF (Integrated in Nav for layout balance) -->
        <div class="mt-10 pl-4 space-y-4">
             <button @click="$emit('download-pdf')" 
                class="flex items-center gap-2 text-cbre-green font-calibre font-medium hover:text-cbre-accent transition-colors group">
                <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 group-hover:animate-bounce" />
                <span>{{ $t('download_pdf') }}</span>
             </button>

             <button v-if="hasBrochure" @click="$emit('view-brochure')" 
                class="flex items-center gap-2 text-cbre-green font-calibre font-medium hover:text-cbre-accent transition-colors group">
                <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
                <span>{{ $t('view_brochure') }}</span>
             </button>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
    sections: { id: string, labelKey: string }[],
    hasBrochure?: boolean
}>()

defineEmits(['download-pdf', 'view-brochure'])

const activeSection = ref(props.sections[0]?.id || '')

const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        activeSection.value = id
    }
}

// Intersection Observer for Scroll Tracking
let observer: IntersectionObserver | null = null
const intersectingIds = new Set<string>()

onMounted(() => {
    const options = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Active when element is near top-center
        threshold: 0
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                intersectingIds.add(entry.target.id)
            } else {
                intersectingIds.delete(entry.target.id)
            }
        })

        // Prioritize the top-most section that is currently visible
        const active = props.sections.find(section => intersectingIds.has(section.id))
        if (active) {
            activeSection.value = active.id
        }
    }, options)

    props.sections.forEach(section => {
        const el = document.getElementById(section.id)
        if (el) observer?.observe(el)
    })
})

onUnmounted(() => {
    observer?.disconnect()
    intersectingIds.clear()
})
</script>
