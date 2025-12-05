<template>
	<div>
		<div id="TopMenu" @mouseenter="isHovered = true" @mouseleave="isHovered = false"
			class="fixed top-0 w-full h-[80px] flex justify-between items-stretch px-6 lg:px-12 transition-all duration-300 z-50 shadow-md font-calibre"
			:class="isLightMode ? 'bg-white text-cbre-green' : 'bg-cbre-green-500 text-white'">

		<div id="LeftMenu" class="flex items-center h-full gap-6">
			<!-- Logo Section -->
			<div class="flex items-center cursor-pointer group" @click="navigateTo('/')">
				<IconCBRELogo class="w-[90px] h-[28px] group-hover:opacity-90 transition-opacity"
					:class="isLightMode ? 'text-cbre-green' : 'text-white'" />
				<div class="text-[16px] font-medium tracking-wide transition-colors duration-300 uppercase transform translate-y-[18px] translate-x-[-8px]"
					:class="isLightMode ? 'text-cbre-green' : 'text-white'">Map</div>
			</div>

			<!-- App Title (Desktop) -->
			<div class="hidden xl:flex items-center h-full">
				<span class="text-[16px] font-normal tracking-wide transition-colors duration-300 transform translate-y-[8px] translate-x-[-8px]"
					:class="isLightMode ? 'text-cbre-green/90' : 'text-white/90'">Property Management System</span>
			</div>
			<!-- App Title (Mobile) -->
			<div class="flex xl:hidden items-center h-full">
				<span class="text-[16px] font-normal tracking-wide transition-colors duration-300 transform translate-y-[8px] translate-x-[-8px]"
					:class="isLightMode ? 'text-cbre-green/90' : 'text-white/90'">PMS</span>
			</div>

			<!-- Search Bar -->
			<div class="hidden lg:flex items-center ml-8 relative group">
				<div class="relative flex items-center">
					<input v-model="searchText" type="text" name="search" autocomplete="off"
						@keyup.enter="onSearchText()"
						class="w-[240px] bg-transparent border-b text-[15px] pb-1 focus:outline-none transition-all duration-300"
						:class="isLightMode ? 'border-cbre-green/30 text-cbre-green placeholder-cbre-green/60 focus:border-cbre-green' : 'border-white/30 text-white placeholder-white/60 focus:border-white'"
						placeholder="Search" />
					<div class="absolute right-0 bottom-2 cursor-pointer"
						@click="propertyStore.searchKeyword === '' ? onSearchText() : onResetKeyword()">
						<IconMagnifier v-if="propertyStore.searchKeyword === ''"
							class="w-[18px] h-[18px] hover:text-cbre-accent transition-colors"
							:class="isLightMode ? 'text-cbre-green' : 'text-white'" />
						<UIcon v-else name="i-heroicons-x-mark"
							class="w-[18px] h-[18px] hover:text-cbre-accent transition-colors"
							:class="isLightMode ? 'text-cbre-green' : 'text-white'" />
					</div>
				</div>
			</div>
		</div>

		<div id="RightMenu" class="flex items-center gap-8 z-20">
			<!-- Transaction Type Filter -->
			<UPopover v-model:open="openTransaction" mode="click" :popper="{ placement: 'bottom-end' }">
				<button
					class="flex items-center gap-2 text-[15px] font-medium hover:text-cbre-green-500 transition-colors focus:outline-none group h-[80px] border-b-2 border-transparent hover:border-cbre-accent"
					:class="isLightMode ? 'text-cbre-green' : 'text-white'">
					<span>Transaction</span>
					<span v-if="selectedTransaction && selectedTransaction.name !== 'All Types'" class="font-normal text-sm ml-1"
						:class="isLightMode ? 'text-cbre-green/80' : 'text-white/80'">
						({{ selectedTransaction.name }})
					</span>
					<UIcon name="i-heroicons-chevron-down"
						class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
				</button>

				<template #content>
					<div class="p-0 w-56 bg-white shadow-lg border-t-4 border-cbre-green-500 rounded-none font-calibre">
						<div v-for="type in transaction" :key="type.name"
							class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-cbre-green-500 text-[15px] border-b border-gray-100 last:border-0 transition-colors"
							:class="{ 'font-bold text-cbre-green-500': selectedTransaction?.name === type.name }"
							@click="selectTransaction(type)">
							{{ type.name }}
							<UIcon v-if="selectedTransaction?.name === type.name" name="i-heroicons-check"
								class="text-cbre-green-500" />
						</div>
					</div>
				</template>
			</UPopover>

			<!-- Sector Filter -->
			<UPopover v-model:open="openSectors" mode="click" :popper="{ placement: 'bottom-end' }">
				<button
					class="flex items-center gap-2 text-[15px] font-medium hover:text-cbre-green-500 transition-colors focus:outline-none group h-[80px] border-b-2 border-transparent hover:border-cbre-accent"
					:class="isLightMode ? 'text-cbre-green' : 'text-white'">
					<span>Sector</span>
					<span v-if="selectedSectors.length > 0" class="font-normal text-sm ml-1"
						:class="isLightMode ? 'text-cbre-green/80' : 'text-white/80'">
						({{ selectedSectorsDisplay }})
					</span>
					<UIcon name="i-heroicons-chevron-down"
						class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
				</button>

				<template #content>
					<div class="p-0 w-64 bg-white shadow-lg border-t-4 border-cbre-green-500 rounded-none font-calibre">
						<div v-for="option in sectors" :key="option.name"
							class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-cbre-green-500 text-[15px] border-b border-gray-100 last:border-0 transition-colors"
							:class="{ 'font-bold text-cbre-green-500': isSelectedSector(option) }"
							@click="toggleSelectedSector(option)">
							{{ option.name }}
							<UIcon v-if="isSelectedSector(option)" name="i-heroicons-check" class="text-cbre-green-500" />
						</div>
					</div>
				</template>
			</UPopover>

			<!-- SubSector Filter -->
			<UPopover v-model:open="openSubSectors" mode="click" :popper="{ placement: 'bottom-end' }">
				<button
					class="flex items-center gap-2 text-[15px] font-medium hover:text-cbre-green-500 transition-colors focus:outline-none group h-[80px] border-b-2 border-transparent hover:border-cbre-accent"
					:class="isLightMode ? 'text-cbre-green' : 'text-white'">
					<span>SubSector</span>
					<span v-if="selectedSubSectors.length > 0" class="font-normal text-sm ml-1"
						:class="isLightMode ? 'text-cbre-green/80' : 'text-white/80'">
						({{ selectedSubSectorsDisplay }})
					</span>
					<UIcon name="i-heroicons-chevron-down"
						class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
				</button>

				<template #content>
					<div class="p-0 w-72 bg-white shadow-lg border-t-4 border-cbre-green-500 rounded-none font-calibre">
						<div v-for="option in subsectors" :key="option.name"
							class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-cbre-green-500 text-[15px] border-b border-gray-100 last:border-0 transition-colors"
							:class="{ 'font-bold text-cbre-green-500': isSelectedSubSector(option) }"
							@click="toggleSelectedSubSector(option)">
							{{ option.name }}
							<UIcon v-if="isSelectedSubSector(option)" name="i-heroicons-check" class="text-cbre-green-500" />
						</div>
					</div>
				</template>
			</UPopover>

			<!-- More Menu -->
			<button @click="openMenuMore = !openMenuMore"
				class="flex items-center gap-2 text-[15px] font-medium hover:text-cbre-green-500 transition-colors focus:outline-none group h-[80px] border-b-2 border-transparent hover:border-cbre-accent"
				:class="[
					isLightMode ? 'text-cbre-green' : 'text-white',
					{ 'border-cbre-accent text-cbre-green-500': openMenuMore }
				]">
				<span>More</span>
				<UIcon name="i-heroicons-chevron-down"
					class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
					:class="{ 'rotate-180': openMenuMore }" />
			</button>

			<!-- Web Search -->
			<button @click="openWebSearchPannel = !openWebSearchPannel"
				class="hidden sm:flex items-center gap-2 text-[15px] font-medium hover:text-cbre-green-500 transition-colors focus:outline-none group h-[80px] border-b-2 border-transparent hover:border-cbre-accent"
				:class="[
					isLightMode ? 'text-cbre-green' : 'text-white',
					{ 'border-cbre-accent text-cbre-green-500': openWebSearchPannel }
				]">
				<span>Web</span>
				<UIcon name="i-heroicons-globe-alt" class="w-5 h-5" />
			</button>

			<!-- User Menu -->
			<UserMenu :is-light-mode="isLightMode" />
		</div>

		</div>

		<!-- More Menu Overlay -->
		<div class="fixed top-[80px] left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden z-40"
			:class="openMenuMore ? 'max-h-[600px] border-t-4 border-cbre-green-500' : 'max-h-0'">
			<MoreMenu />
		</div>

		<!-- Text Search Panel (Mobile) -->
		<ClientOnly>
			<div v-if="isMobileOrTablet" class="text-search-pannel shadow-2xl"
				:class="openTextSearchPannel ? 'z-10 visible animate-slideShowFromRight' : 'z-0 delay-100 animate-slideHideToRight'">
				<NavTextSearchPannel @isClosed="collapseAll" />
			</div>
		</ClientOnly>

		<!-- Filter Panel (Mobile) -->
		<ClientOnly>
			<div v-if="isMobile" class="filter-pannel shadow-2xl"
				:class="openFilterPannel ? 'z-10 visible animate-slideShowFromRight' : 'z-0 delay-100 animate-slideHideToRight'">
				<NavFilterPannel @isClosed="collapseAll" />
			</div>
		</ClientOnly>

		<!-- Web Search Panel -->
		<div class="web-search-pannel shadow-2xl"
			:class="openWebSearchPannel ? 'z-10 animate-slideShowFromRight' : 'z-0 delay-100 animate-slideHideToRight'">
			<NavWebSearchPannel @isClosed="collapseAll" />
		</div>

		<!-- Backdrop -->
		<div v-if="uiStore.isMenuOverlay || uiStore.isUserProfileModalOpen" class="fixed inset-0 top-[80px] bg-black/40 backdrop-blur-sm z-30"
			@click="collapseAll"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUiStore } from '~/stores/ui'
import { usePropertyStore } from '~/stores/property'
import MoreMenu from '~/components/nav/MoreMenu.vue'
import UserMenu from '~/components/nav/UserMenu.vue'
import NavFilterPannel from '~/components/nav/mobile/FilterPannel.vue'
import NavTextSearchPannel from '~/components/nav/mobile/TextSearchPannel.vue'
import NavWebSearchPannel from '~/components/nav/web/SearchPannel.vue'

import { storeToRefs } from 'pinia'

const uiStore = useUiStore()
const propertyStore = usePropertyStore()
const device = useDevice()
const isMobile = device.isMobile
const isMobileOrTablet = computed(() => device.isMobile || device.isTablet)

const { isMenuOverlay, isUserProfileModalOpen, isLightMode: storeIsLightMode } = storeToRefs(uiStore)

// Hover State
const isHovered = ref(false)
const isLightMode = computed(() => storeIsLightMode.value)

watch([isHovered, isMenuOverlay, isUserProfileModalOpen], ([hover, menu, profile]) => {
    const shouldBeLight = hover || menu || profile;
    if (uiStore.isLightMode !== shouldBeLight) {
        uiStore.setLightMode(shouldBeLight);
    }
    //console.log('TopBar State Changed:', { hover, menu, profile, isLightMode: shouldBeLight });
}, { immediate: true });

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
        { name: 'All' },
        { name: 'Office' },
        { name: 'Logistics' },
        { name: 'Retail' },
        { name: 'Hospital' }
]
const selectedSectors = ref<{ name: string }[]>([])
const openSectors = ref(false)

const isSelectedSector = (option: { name: string }) => {
        if (option.name === 'All') return selectedSectors.value.length === 0
        return selectedSectors.value.some(s => s.name === option.name)
}
const toggleSelectedSector = (option: { name: string }) => {
        if (option.name === 'All') {
                selectedSectors.value = []
        } else {
                if (isSelectedSector(option)) {
                        selectedSectors.value = selectedSectors.value.filter(s => s.name !== option.name)
                } else {
                        selectedSectors.value.push(option)
                }
        }
        propertyStore.updateFilter('filterSectorTypes', selectedSectors.value.map(s => s.name))
}

const selectedSectorsDisplay = computed(() => {
        if (selectedSectors.value.length === 0) return 'All Types'
        if (selectedSectors.value.length === 1) return selectedSectors.value[0]?.name
        return `${selectedSectors.value[0]?.name} (+${selectedSectors.value.length - 1})`
})

// SubSectors
const subsectors = [
        { name: 'All' },
        { name: 'Cold Logistic' },
        { name: 'Dry Logistic' },
        { name: 'Mixed Logistic' },
        { name: 'Central Business District' }
]
const selectedSubSectors = ref<{ name: string }[]>([])
const openSubSectors = ref(false)

const isSelectedSubSector = (option: { name: string }) => {
        if (option.name === 'All') return selectedSubSectors.value.length === 0
        return selectedSubSectors.value.some(s => s.name === option.name)
}
const toggleSelectedSubSector = (option: { name: string }) => {
        if (option.name === 'All') {
                selectedSubSectors.value = []
        } else {
                if (isSelectedSubSector(option)) {
                        selectedSubSectors.value = selectedSubSectors.value.filter(s => s.name !== option.name)
                } else {
                        selectedSubSectors.value.push(option)
                }
        }
        propertyStore.updateFilter('filterSubSectorTypes', selectedSubSectors.value.map(s => s.name))
}

const selectedSubSectorsDisplay = computed(() => {
        if (selectedSubSectors.value.length === 0) return 'All Types'
        if (selectedSubSectors.value.length === 1) return selectedSubSectors.value[0]?.name
        return `${selectedSubSectors.value[0]?.name} (+${selectedSubSectors.value.length - 1})`
})

// More Menu
const openMenuMore = ref(false)
const openWebSearchPannel = ref(false)
const openTextSearchPannel = ref(false)
const openFilterPannel = ref(false)

const collapseAll = () => {
        uiStore.isMenuOverlay = false
        openTransaction.value = false
        openSectors.value = false
        openSubSectors.value = false
        openMenuMore.value = false
        openWebSearchPannel.value = false
        openTextSearchPannel.value = false
        openFilterPannel.value = false
        uiStore.toggleUserProfileModal(false)
}

watch([openTransaction, openSectors, openSubSectors, openMenuMore, openWebSearchPannel, openTextSearchPannel, openFilterPannel], ([t, s, ss, m, w, ts, f]) => {
        uiStore.isMenuOverlay = t || s || ss || m || w || ts || f
})

</script>

<style scoped>
.search-input {
        width: 100%;
        padding: 5px 10px;
}

.text-search-pannel,
.web-search-pannel,
.filter-pannel {
        position: absolute;
        top: 80px;
        right: -400px;
        width: 400px;
        min-width: 400px;
        height: calc(100vh - 80px);
        z-index: 100;
        background-color: white;
}

@media (max-width: 400px) {
        .text-search-pannel,
        .web-search-pannel,
        .filter-pannel {
                width: 100%;
                min-width: 100%;
        }
}
</style>
