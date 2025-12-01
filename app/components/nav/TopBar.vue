<template>
        <div id="TopMenu"
                class="fixed top-0 w-full h-[80px] flex justify-between items-stretch px-4 md:px-6 lg:px-10 transition-all duration-500 z-50"
                :class="uiStore.isMenuOverlay ? 'bg-white text-cbre-green border-gray-200 border-b' : 'bg-cbre-green text-white'">

                <div id="LeftMenu" class="flex items-center w-full h-full">
                        <div class="min-w-[110px] flex items-center justify-center cursor-pointer"
                                @click="navigateTo('/')">
                                <IconCBRELogo class="w-[80px] h-[25px] text-inherit" />
                                <sub class="text-[14px] font-bold translate-y-1 ml-1">Map</sub>
                        </div>
                        <div class="ml-[10px] h-[30px] pt-[8px] font-sans hidden xl:flex whitespace-nowrap">
                                Property Management System
                        </div>
                        <div class="ml-[10px] h-[30px] pt-[8px] font-sans flex xl:hidden whitespace-nowrap">
                                PMS
                        </div>

                        <!-- Search Bar -->
                        <div
                                class="search flex justify-end lg:justify-start w-full min-w-[30px] max-w-full lg:max-w-[300px] ml-5 lg:mx-5">
                                <div class="hidden lg:flex items-center w-full h-full relative">
                                        <input v-model="searchText" type="text" name="search" autocomplete="off"
                                                @keyup.enter="onSearchText()"
                                                class="peer search-input relative flex-1 text-sm bg-transparent border-b-2 focus:outline-none transition-colors"
                                                :class="uiStore.isMenuOverlay ? 'border-cbre-green/50 focus:border-cbre-green text-cbre-green placeholder-cbre-green/50' : 'border-white/50 focus:border-white text-white placeholder-white/50'"
                                                placeholder="Search by Name, Address..." />

                                        <div v-if="propertyStore.searchKeyword === ''"
                                                class="absolute right-0 cursor-pointer" @click="onSearchText()">
                                                <IconMagnifier
                                                        class="w-[18px] h-[18px] text-inherit hover:text-cbre-accent" />
                                        </div>
                                        <div v-else class="absolute right-0 cursor-pointer" @click="onResetKeyword()">
                                                <UIcon name="i-heroicons-x-mark"
                                                        class="w-[18px] h-[18px] text-inherit" />
                                        </div>
                                </div>
                        </div>
                </div>

                <div id="RightMenu" class="flex items-center gap-4 z-20">
                        <!-- Transaction Type Filter -->
                        <UPopover v-model:open="openTransaction" :popper="{ placement: 'bottom-end' }">
                                <UButton variant="ghost" color="neutral"
                                        :class="uiStore.isMenuOverlay ? 'text-cbre-green hover:bg-gray-100' : 'text-white hover:bg-white/10'">
                                        <span
                                                class="font-light text-xs -translate-y-2 absolute top-1 right-2 opacity-70">Transaction</span>
                                        <span class="mt-2">{{ selectedTransaction?.name }}</span>
                                        <UIcon name="i-heroicons-chevron-down" class="ml-2" />
                                </UButton>

                                <template #content>
                                        <div class="p-2 w-48 bg-white">
                                                <div v-for="type in transaction" :key="type.name"
                                                        class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center rounded-none"
                                                        :class="{ 'bg-cbre-green text-white hover:bg-cbre-green': selectedTransaction?.name === type.name }"
                                                        @click="selectTransaction(type)">
                                                        {{ type.name }}
                                                        <UIcon v-if="selectedTransaction?.name === type.name"
                                                                name="i-heroicons-check" />
                                                </div>
                                        </div>
                                </template>
                        </UPopover>

                        <!-- Sector Filter -->
                        <UPopover v-model:open="openSectors" :popper="{ placement: 'bottom-end' }">
                                <UButton variant="ghost" color="neutral"
                                        :class="uiStore.isMenuOverlay ? 'text-cbre-green hover:bg-gray-100' : 'text-white hover:bg-white/10'">
                                        <span
                                                class="font-light text-xs -translate-y-2 absolute top-1 right-2 opacity-70">Sector</span>
                                        <span class="mt-2">{{ selectedSectorsDisplay }}</span>
                                        <UIcon name="i-heroicons-chevron-down" class="ml-2" />
                                </UButton>

                                <template #content>
                                        <div class="p-2 w-56 bg-white grid grid-cols-1 gap-1">
                                                <div v-for="option in sectors" :key="option.name"
                                                        class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center rounded-none"
                                                        :class="{ 'bg-cbre-green text-white hover:bg-cbre-green': isSelectedSector(option) }"
                                                        @click="toggleSelectedSector(option)">
                                                        {{ option.name }}
                                                        <UIcon v-if="isSelectedSector(option)"
                                                                name="i-heroicons-check" />
                                                </div>
                                        </div>
                                </template>
                        </UPopover>

                        <!-- TODO: SubSector Filter -->
                        <!-- TODO: More Menu -->
                        <!-- TODO: User Menu -->
                </div>

                <!-- Backdrop -->
                <div v-if="uiStore.isMenuOverlay" class="fixed inset-0 top-[80px] bg-black/25 backdrop-blur-sm z-40"
                        @click="collapseAll"></div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUiStore } from '~/stores/ui'
import { usePropertyStore } from '~/stores/property'

const uiStore = useUiStore()
const propertyStore = usePropertyStore()

// Search
const searchText = ref('')
const onSearchText = () => {
        propertyStore.searchKeyword = searchText.value
        propertyStore.applyFilter()
}
const onResetKeyword = () => {
        searchText.value = ''
        propertyStore.searchKeyword = ''
        propertyStore.applyFilter()
}

// Transaction Types
const transaction = [
        { name: 'All Types' },
        { name: 'Lease' },
        { name: 'Sale' },
        { name: 'Sale/Lease' }
]
const selectedTransaction = ref(transaction[0])
const openTransaction = ref(false)

const selectTransaction = (type: any) => {
        selectedTransaction.value = type
        propertyStore.updateFilter('filterTransactionType', type.name === 'All Types' ? '' : type.name)
        openTransaction.value = false
}

// Sectors
const sectors = [
        { name: 'Office' },
        { name: 'Logistics' },
        { name: 'Retail' },
        { name: 'Hospital' }
]
const selectedSectors = ref<{ name: string }[]>([])
const openSectors = ref(false)

const isSelectedSector = (option: { name: string }) => selectedSectors.value.some(s => s.name === option.name)
const toggleSelectedSector = (option: { name: string }) => {
        if (isSelectedSector(option)) {
                selectedSectors.value = selectedSectors.value.filter(s => s.name !== option.name)
        } else {
                selectedSectors.value.push(option)
        }
        propertyStore.updateFilter('filterSectorTypes', selectedSectors.value.map(s => s.name))
}

const selectedSectorsDisplay = computed(() => {
        if (selectedSectors.value.length === 0) return 'All Types'
        if (selectedSectors.value.length === 1) return selectedSectors.value[0]?.name
        return `${selectedSectors.value[0]?.name} (+${selectedSectors.value.length - 1})`
})

const collapseAll = () => {
        uiStore.isMenuOverlay = false
        openTransaction.value = false
        openSectors.value = false
}

watch([openTransaction, openSectors], ([t, s]) => {
        uiStore.isMenuOverlay = t || s
})

</script>

<style scoped>
.search-input {
        width: 100%;
        padding: 5px 10px;
}
</style>
