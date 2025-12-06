<template>
	<div class="flex flex-col w-full h-[calc(100vh-80px)] z-20 bg-white overflow-y-auto">
		<div class="flex flex-col w-full px-6 py-4 space-y-6 font-calibre">

			<!-- Web Search (Location) -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('webSearch')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">Location</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.webSearch }" />
				</button>
				<div v-show="openSections.webSearch" class="mt-4 pl-1">
					<div class="relative w-full mb-4">
						<input v-model="searchWebText" type="text" autocomplete="off" @keyup.enter="onWebSearch"
							class="cbre-input-underlined pr-16" placeholder="Search for Name, Address..." />
						<div class="absolute right-0 bottom-2 flex items-center gap-2">
							<div v-if="searchWebText !== ''" @click="onResetWebSearch" class="cursor-pointer p-1">
								<UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-gray-400" />
							</div>
							<div @click="onWebSearch" class="cursor-pointer p-1">
								<IconMagnifier class="w-5 h-5 text-cbre-green-500" />
							</div>
						</div>
					</div>
					<!-- Geocoder Component -->
					<NavWebGeocoder ref="geocoderRef" />
				</div>
			</div>

			<!-- Transaction Type -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('transaction')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">Transaction Type</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.transaction }" />
				</button>
				<div v-show="openSections.transaction" class="mt-2 space-y-2 pl-2">
					<div v-for="type in transaction" :key="type.name" @click="selectTransaction(type)"
						class="flex items-center gap-3 py-2 cursor-pointer select-none">
						<div class="w-5 h-5 border border-cbre-green-500 rounded-full flex items-center justify-center">
							<div v-if="selectedTransaction?.name === type.name"
								class="w-3 h-3 bg-cbre-green-500 rounded-full"></div>
						</div>
						<span class="cbre-filter-text text-base"
							:class="{ 'cbre-filter-text text-base--active': selectedTransaction?.name === type.name }">
							{{ type.name }}
						</span>
					</div>
				</div>
			</div>

			<!-- Sectors -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('sectors')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">Sector</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.sectors }" />
				</button>
				<div v-show="openSections.sectors" class="mt-2 space-y-2 pl-2">
					<div v-for="option in sectors" :key="option.name" @click="toggleSelectedSector(option)"
						class="flex items-center gap-3 py-2 cursor-pointer select-none">
						<div class="w-5 h-5 border border-cbre-green-500 flex items-center justify-center">
							<UIcon v-if="isSelectedSector(option)" name="i-heroicons-check"
								class="w-4 h-4 text-cbre-green-500" />
						</div>
						<span class="cbre-filter-text text-base"
							:class="{ 'cbre-filter-text text-base--active': isSelectedSector(option) }">
							{{ option.name }}
						</span>
					</div>
				</div>
			</div>

			<!-- SubSectors -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('subsectors')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">SubSector</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.subsectors }" />
				</button>
				<div v-show="openSections.subsectors" class="mt-2 space-y-2 pl-2">
					<div v-for="option in subsectors" :key="option.name" @click="toggleSelectedSubSector(option)"
						class="flex items-center gap-3 py-2 cursor-pointer select-none">
						<div class="w-5 h-5 border border-cbre-green-500 flex items-center justify-center">
							<UIcon v-if="isSelectedSubSector(option)" name="i-heroicons-check"
								class="w-4 h-4 text-cbre-green-500" />
						</div>
						<span class="cbre-filter-text text-base"
							:class="{ 'cbre-filter-text text-base--active': isSelectedSubSector(option) }">
							{{ option.name }}
						</span>
					</div>
				</div>
			</div>

			<!-- Size -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('size')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">Size</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.size }" />
				</button>
				<div v-show="openSections.size" class="mt-4 pl-1 space-y-6">
					<!-- GFA -->
					<div class="space-y-2">
						<div class="flex justify-between items-baseline">
							<span class="cbre-filter-text text-base">GFA</span>
							<div class="flex items-center">
								<span class="text-base cursor-pointer" @click="localMoreFilters.gfaType = false"
									:class="{ 'font-bold': !localMoreFilters.gfaType }">py</span>
								<USwitch v-model="localMoreFilters.gfaType" size="xl" class="px-1" :ui="switchUi" />
								<span class="text-base cursor-pointer" @click="localMoreFilters.gfaType = true"
									:class="{ 'font-bold': localMoreFilters.gfaType }">sqm</span>
							</div>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.gfa" :min="0" :max="100000" :step="100" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							thoundsGfa(localMoreFilters.gfa) }}</div>
					</div>
					<!-- NFA -->
					<div class="space-y-2">
						<div class="flex justify-between items-baseline">
							<span class="cbre-filter-text text-base">NFA</span>
							<div class="flex items-center">
								<span class="text-base cursor-pointer" @click="localMoreFilters.nfaType = false"
									:class="{ 'font-bold': !localMoreFilters.nfaType }">py</span>
								<USwitch v-model="localMoreFilters.nfaType" size="xs" class="px-1" :ui="switchUi" />
								<span class="text-base cursor-pointer" @click="localMoreFilters.nfaType = true"
									:class="{ 'font-bold': localMoreFilters.nfaType }">sqm</span>
							</div>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.nfa" :min="0" :max="100000" :step="100" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							thoundsNfa(localMoreFilters.nfa) }}</div>
					</div>
					<!-- Site Area -->
					<div class="space-y-2">
						<div class="flex justify-between items-baseline">
							<span class="cbre-filter-text text-base">Site Area</span>
							<div class="flex items-center">
								<span class="text-base cursor-pointer" @click="localMoreFilters.siteAreaType = false"
									:class="{ 'font-bold': !localMoreFilters.siteAreaType }">py</span>
								<USwitch v-model="localMoreFilters.siteAreaType" size="xs" class="px-1"
									:ui="switchUi" />
								<span class="text-base cursor-pointer" @click="localMoreFilters.siteAreaType = true"
									:class="{ 'font-bold': localMoreFilters.siteAreaType }">sqm</span>
							</div>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.siteArea" :min="0" :max="100000" :step="100" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							thoundsSite(localMoreFilters.siteArea) }}</div>
					</div>
				</div>
			</div>

			<!-- Period -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('period')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">Period</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.period }" />
				</button>
				<div v-show="openSections.period" class="mt-4 pl-1 space-y-6">
					<!-- Built -->
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Built</span>
							<button @click="resetLocalFilter('built')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.built" :min="1960" :max="currentYear" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{ localMoreFilters.built
						}}</div>
					</div>
					<!-- Reno -->
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Reno</span>
							<button @click="resetLocalFilter('reno')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.reno" :min="1960" :max="currentYear" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{ localMoreFilters.reno
						}}</div>
					</div>
					<!-- Sales -->
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Sales</span>
							<button @click="resetLocalFilter('sales')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.sales" :min="1960" :max="currentYear" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{ localMoreFilters.sales
						}}</div>
					</div>
					<!-- Leases -->
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Leases</span>
							<button @click="resetLocalFilter('leases')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.leases" :min="1960" :max="currentYear" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{ localMoreFilters.leases
						}}</div>
					</div>
				</div>
			</div>

			<!-- Facility -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('facility')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">Facility</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.facility }" />
				</button>
				<div v-show="openSections.facility" class="mt-4 pl-1 space-y-6">
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Buildings</span>
							<button @click="resetLocalFilter('buildings')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.buildings" :min="0" :max="10" size="xs" :ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							localMoreFilters.buildings }}</div>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Basement</span>
							<button @click="resetLocalFilter('basement')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.basement" :min="0" :max="10" size="xs" :ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							localMoreFilters.basement }}</div>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Upper Floor</span>
							<button @click="resetLocalFilter('upperFloor')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.upperFloor" :min="0" :max="50" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							localMoreFilters.upperFloor }}</div>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Elevator</span>
							<button @click="resetLocalFilter('elevator')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.elevator" :min="0" :max="20" size="xs" :ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							localMoreFilters.elevator }}</div>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Parking</span>
							<button @click="resetLocalFilter('parking')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.parking" :min="0" :max="500" :step="10" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							localMoreFilters.parking }}</div>
					</div>
				</div>
			</div>

			<!-- Finance -->
			<div class="filter-section border-b border-gray-100">
				<button @click="toggleSection('finance')"
					class="flex justify-between items-center w-full py-5 group focus:outline-none">
					<span class="cbre-mobile-nav-item">Finance</span>
					<UIcon name="i-heroicons-chevron-right"
						class="w-5 h-5 text-cbre-green transition-transform duration-200"
						:class="{ 'rotate-90': openSections.finance }" />
				</button>
				<div v-show="openSections.finance" class="mt-4 pl-1 space-y-6">
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">IOD</span>
							<button @click="resetLocalFilter('iod')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.iod" :min="0" :max="10" :step="0.1" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{ localMoreFilters.iod }}
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">GDM</span>
							<button @click="resetLocalFilter('gdm')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.gdm" :min="0" :max="10" :step="0.1" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{ localMoreFilters.gdm }}
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">NOC</span>
							<button @click="resetLocalFilter('noc')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.noc" :min="0" :max="100000" :step="1000" size="xs"
								:ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{ localMoreFilters.noc }}
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="cbre-filter-text text-base">Eff. Ratio</span>
							<button @click="resetLocalFilter('effRatio')" class="cbre-button-badge">Reset</button>
						</div>
						<div class="px-2">
							<USlider v-model="localMoreFilters.effRatio" :min="0" :max="100" size="xs" :ui="sliderUi" />
						</div>
						<div class="text-right text-gray-500 text-base">{{
							localMoreFilters.effRatio }}</div>
					</div>
				</div>
			</div>

		</div>

		<!-- Actions -->
		<div class="w-full px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 shadow-lg">
			<div class="grid grid-cols-2 gap-3">
				<button @click="clearAll" class="w-full cbre-button-secondary">
					Reset
				</button>
				<button @click="applyFilters" class="w-full cbre-button-primary">
					Apply
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { usePropertyStore } from '~/stores/property'
import { useFormat } from '~/composables/useFormat'
import { useMapStore } from '~/stores/map'

const emit = defineEmits(['isClosed'])
const propertyStore = usePropertyStore()
const { numberFormat } = useFormat()
const mapStore = useMapStore()

const currentYear = computed(() => new Date().getFullYear())

// Custom UI Config for Sliders (Thinner track)
const sliderUi = { track: 'h-[1px] bg-gray-200', range: 'h-[1px] bg-cbre-green-500', thumb: 'ring-0 !w-2 !h-2 bg-cbre-green-500' }

// Custom UI Config for Switches (Match Slider Design)
const switchUi = {
	base: 'h-1 w-10 rounded-none border-0 ring-0 transition-transform',
	thumb: 'ring-0 !w-2 !h-2 bg-cbre-green-400 data-[state=checked]:!translate-x-8',
}

// Sections Toggle State
const openSections = reactive({
	webSearch: true,
	transaction: true,
	sectors: true,
	subsectors: false,
	size: false,
	period: false,
	facility: false,
	finance: false
})

const toggleSection = (section: keyof typeof openSections) => {
	openSections[section] = !openSections[section]
}

// --- Data Constants (Mirrored from TopBar.vue) ---
const transaction = [
	{ name: 'All Types' },
	{ name: 'Lease' },
	{ name: 'Sale' },
	{ name: 'Sale/Lease' }
]

const sectors = [
	{ name: 'All' },
	{ name: 'Office' },
	{ name: 'Logistics' },
	{ name: 'Retail' },
	{ name: 'Hospital' }
]

const subsectors = [
	{ name: 'All' },
	{ name: 'Cold Logistic' },
	{ name: 'Dry Logistic' },
	{ name: 'Mixed Logistic' },
	{ name: 'Central Business District' }
]

// --- State Management ---
// Primary Filters (Transaction, Sector, SubSector)
const selectedTransaction = ref(transaction.find(t =>
	t.name === (propertyStore.filterTransactionType || 'All Types')
) || transaction[0])

const selectedSectors = ref<{ name: string }[]>(
	propertyStore.filterSectorTypes.length > 0
		? sectors.filter(s => propertyStore.filterSectorTypes.includes(s.name))
		: []
)

const selectedSubSectors = ref<{ name: string }[]>(
	propertyStore.filterSubSectorTypes.length > 0
		? subsectors.filter(s => propertyStore.filterSubSectorTypes.includes(s.name))
		: []
)

// Secondary Filters (More Filters) - Local Copy
// We init from store, allowing user to play with sliders, then commit on Apply.
const localMoreFilters = ref<any>({})

onMounted(() => {
	if (propertyStore.moreFilters) {
		localMoreFilters.value = JSON.parse(JSON.stringify(propertyStore.moreFilters))
	}
})


// --- Web Search Logic ---
const searchWebText = ref('')
interface GeocoderComponent {
	searchResult: (keyword: string) => Promise<void>;
}
const geocoderRef = ref<GeocoderComponent | null>(null)

const onWebSearch = () => {
	if (!searchWebText.value.trim()) return
	geocoderRef.value?.searchResult(searchWebText.value)
}

const onResetWebSearch = () => {
	searchWebText.value = ''
	// Reset Map Store values if needed, or just clear input
	// mapStore.searchedMarkers = [] // Optional: if we want to clear map pins too
}


// --- Logic: Transaction ---
const selectTransaction = (type: any) => {
	selectedTransaction.value = type
}

// --- Logic: Sectors ---
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
}

// --- Logic: SubSectors ---
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
}

// --- Logic: More Filters Formatting & Reset ---
const formatValue = (value: number, type: boolean) => {
	const unit = type ? 'sqm' : 'py';
	return numberFormat(value, 0) + unit;
};

const thoundsGfa = (value: number) => formatValue(value, localMoreFilters.value.gfaType);
const thoundsNfa = (value: number) => formatValue(value, localMoreFilters.value.nfaType);
const thoundsSite = (value: number) => formatValue(value, localMoreFilters.value.siteAreaType);

const resetLocalFilter = (key: string) => {
	if (localMoreFilters.value) {
		localMoreFilters.value[key] = 0;
	}
};


// --- Actions ---
const clearAll = () => {
	selectedTransaction.value = transaction[0] // All Types
	selectedSectors.value = [] // All
	selectedSubSectors.value = [] // All

	// Reset Local More Filters
	if (propertyStore.moreFilters) {
		// Reset to default structure (or just empty values? Better to fetch 'default' from store or hardcode reset)
		// For now simple reset of keys we know
		localMoreFilters.value = JSON.parse(JSON.stringify(propertyStore.moreFilters)); // Revert to store? No, clear means RESET.
		// Hard reset logic matching MoreMenu default state roughly or just re-clone PropertyStore clean state if accessible.
		// Let's iterate keys and zero them out for sliders.
		['gfa', 'nfa', 'siteArea', 'buildings', 'basement', 'upperFloor', 'elevator', 'parking', 'iod', 'gdm', 'noc', 'effRatio'].forEach(k => localMoreFilters.value[k] = 0);
		['built', 'reno', 'sales', 'leases'].forEach(k => localMoreFilters.value[k] = 0);
		// Actually best to just set them to 0 or min.
	}

	searchWebText.value = ''
}

const applyFilters = () => {
	// 1. Sync Primary Filters
	propertyStore.updateFilter('filterTransactionType', selectedTransaction.value?.name === 'All Types' ? '' : (selectedTransaction.value?.name || ''))
	propertyStore.updateFilter('filterSectorTypes', selectedSectors.value.map(s => s.name))
	propertyStore.updateFilter('filterSubSectorTypes', selectedSubSectors.value.map(s => s.name))

	// 2. Sync More Filters
	if (localMoreFilters.value) {
		propertyStore.moreFilters = JSON.parse(JSON.stringify(localMoreFilters.value))
	}

	// 3. Trigger Filter Action
	propertyStore.applyFilter()

	// 4. Close Panel
	emit('isClosed', true)
}

</script>

<style scoped>
/* Custom Switch coloring if needed */
</style>
