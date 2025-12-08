<template>
	<div>
		<!-- Force Hydration Update -->
		<div id="TopMenu" @mouseenter="isHovered = true" @mouseleave="isHovered = false"
			class="fixed top-0 w-full h-[8rem] transition-all duration-300 z-50 shadow-md font-calibre"
			:class="isLightMode ? 'bg-white text-cbre-green' : 'bg-cbre-green text-white'">

			<!-- === DESKTOP NAVIGATION === -->
			<div class="hidden lg:flex w-full h-full justify-between items-stretch px-12">
				<div id="DesktopLeftMenu" class="flex items-center h-full gap-6">
					<!-- Logo Section -->
					<div class="cbre-nav-brand group" @click="navigateTo('/')">
						<IconCBRELogo
							class="w-[9rem] h-[2.8rem] group-hover:opacity-90 transition-opacity"
							:class="isLightMode ? 'text-cbre-green' : 'text-white'" />
						<sub class="cbre-nav-brand-label"
							:class="isLightMode ? 'text-cbre-green' : '!text-white'">{{
								$t('nav.brand.map') }}</sub>
					</div>

					<!-- App Title -->
					<div class="cbre-layout-topbar-separator border-gray-200/20">
						<span class="cbre-nav-title transition-colors duration-300"
							:class="isLightMode ? 'text-cbre-green/90' : '!text-white/90'">{{
								$t('nav.brand.title')
							}}</span>
					</div>

					<!-- Search Bar -->
					<div class="flex items-center ml-8 relative group">
						<div class="relative flex items-center">
							<input v-model="searchText" type="text" name="search"
								autocomplete="off" @keyup.enter="onSearchText()"
								class="w-[24rem] bg-transparent border-b text-[1.5rem] pb-1 focus:outline-none transition-all duration-300"
								:class="isLightMode ? 'border-cbre-green/30 text-cbre-green placeholder-cbre-green/60 focus:border-cbre-green' : 'border-white/30 text-white placeholder-white/60 focus:border-white'"
								:placeholder="$t('search_placeholder')" />
							<div v-if="isHydrationComplete"
								class="absolute right-0 bottom-2 cursor-pointer"
								@click="propertyStore.searchKeyword === '' ? onSearchText() : onResetKeyword()">
								<IconMagnifier v-if="propertyStore.searchKeyword === ''"
									class="w-[1.8rem] h-[1.8rem] hover:text-cbre-accent transition-colors"
									:class="isLightMode ? 'text-cbre-green' : 'text-white'" />
								<UIcon v-else name="i-heroicons-x-mark"
									class="w-[1.8rem] h-[1.8rem] hover:text-cbre-accent transition-colors"
									:class="isLightMode ? 'text-cbre-green' : 'text-white'" />
							</div>
						</div>
					</div>
				</div>

				<div id="DesktopRightMenu" class="flex items-center gap-8 z-20">
					<!-- Transaction Type Filter -->
					<UPopover v-model:open="openTransaction" mode="click"
						:popper="{ placement: 'bottom-end' }">
						<button class="group cbre-button-topbar-menu"
							:class="isLightMode ? 'text-cbre-green' : 'text-white'">
							<span>{{ $t('nav.filter.transaction') }}</span>
							<span v-if="selectedTransaction && selectedTransaction.name !== 'All Types'"
								class="cbre-text-topbar-sublabel"
								:class="isLightMode ? 'text-cbre-green/80' : 'text-white/80'">
								({{ $t(selectedTransaction.labelKey) }})
							</span>
							<UIcon name="i-heroicons-chevron-down"
								class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
						</button>

						<template #content>
							<div
								class="p-0 w-56 bg-white shadow-lg border-t-4 border-cbre-green rounded-none font-calibre">
								<div v-for="type in transaction" :key="type.name"
									class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-cbre-green-800 text-[1.5rem] border-b border-gray-100 last:border-0 transition-colors"
									:class="{ 'font-bold text-cbre-green-800': selectedTransaction?.name === type.name }"
									@click="selectTransaction(type)">
									{{ $t(type.labelKey) }}
									<UIcon v-if="selectedTransaction?.name === type.name"
										name="i-heroicons-check"
										class="text-cbre-green-800" />
								</div>
							</div>
						</template>
					</UPopover>

					<!-- Sector Filter -->
					<UPopover v-model:open="openSectors" mode="click"
						:popper="{ placement: 'bottom-end' }">
						<button class="group cbre-button-topbar-menu"
							:class="isLightMode ? 'text-cbre-green' : 'text-white'">
							<span>{{ $t('nav.filter.sector') }}</span>
							<span v-if="selectedSectors.length > 0"
								class="cbre-text-topbar-sublabel"
								:class="isLightMode ? 'text-cbre-green/80' : 'text-white/80'">
								({{ selectedSectorsDisplay }})
							</span>
							<UIcon name="i-heroicons-chevron-down"
								class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
						</button>

						<template #content>
							<div
								class="p-0 w-64 bg-white shadow-lg border-t-4 border-cbre-green rounded-none font-calibre">
								<div v-for="option in sectors" :key="option.name"
									class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-cbre-green-800 text-[1.5rem] border-b border-gray-100 last:border-0 transition-colors"
									:class="{ 'font-bold text-cbre-green-800': isSelectedSector(option) }"
									@click="toggleSelectedSector(option)">
									{{ $t(option.labelKey) }}
									<UIcon v-if="isSelectedSector(option)"
										name="i-heroicons-check"
										class="text-cbre-green-800" />
								</div>
							</div>
						</template>
					</UPopover>

					<!-- SubSector Filter -->
					<UPopover v-model:open="openSubSectors" mode="click"
						:popper="{ placement: 'bottom-end' }">
						<button class="group cbre-button-topbar-menu"
							:class="isLightMode ? 'text-cbre-green' : 'text-white'">
							<span>{{ $t('nav.filter.subsector') }}</span>
							<span v-if="selectedSubSectors.length > 0"
								class="cbre-text-topbar-sublabel"
								:class="isLightMode ? 'text-cbre-green/80' : 'text-white/80'">
								({{ selectedSubSectorsDisplay }})
							</span>
							<UIcon name="i-heroicons-chevron-down"
								class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
						</button>

						<template #content>
							<div
								class="p-0 w-72 bg-white shadow-lg border-t-4 border-cbre-green rounded-none font-calibre">
								<div v-for="option in subsectors" :key="option.name"
									class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-cbre-green-800 text-[1.5rem] border-b border-gray-100 last:border-0 transition-colors"
									:class="{ 'font-bold text-cbre-green-800': isSelectedSubSector(option) }"
									@click="toggleSelectedSubSector(option)">
									{{ $t(option.labelKey) }}
									<UIcon v-if="isSelectedSubSector(option)"
										name="i-heroicons-check"
										class="text-cbre-green-800" />
								</div>
							</div>
						</template>
					</UPopover>

					<!-- More Menu -->
					<button @click="openMenuMore = !openMenuMore"
						class="group cbre-button-topbar-menu" :class="[
							isLightMode ? 'text-cbre-green' : 'text-white',
							{ 'border-cbre-accent text-cbre-green-800': openMenuMore }
						]">
						<span>{{ $t('nav.menu.more') }}</span>
						<UIcon name="i-heroicons-chevron-down"
							class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
							:class="{ 'rotate-180': openMenuMore }" />
					</button>

					<!-- Web Search -->
					<button @click="openWebSearchPannel = !openWebSearchPannel"
						class="hidden sm:flex group cbre-button-topbar-menu" :class="[
							isLightMode ? 'text-cbre-green' : 'text-white',
							{ 'border-cbre-accent text-cbre-green-800': openWebSearchPannel }
						]">
						<span>{{ $t('nav.menu.web') }}</span>
						<UIcon name="i-heroicons-globe-alt" class="w-5 h-5" />
					</button>

					<!-- Language Switcher -->
					<CommonLanguageSwitcher />

					<!-- User Menu -->
					<NavUserMenu :isLightMode="isLightMode" />
				</div>
			</div>

			<!-- === MOBILE NAVIGATION === -->
			<div class="flex lg:hidden w-full h-full justify-between items-center px-6">
				<div id="MobileLeftMenu" class="flex items-center h-full gap-4">
					<!-- Logo Section -->
					<div class="cbre-nav-brand group" @click="navigateTo('/')">
						<IconCBRELogo
							class="w-[9rem] h-[2.8rem] group-hover:opacity-90 transition-opacity"
							:class="isLightMode ? 'text-cbre-green' : 'text-white'" />
						<sub class="cbre-nav-brand-label"
							:class="isLightMode ? 'text-cbre-green' : '!text-white'">{{
								$t('nav.brand.map') }}</sub>
					</div>

					<!-- App Title -->
					<div class="cbre-layout-topbar-separator border-gray-200/20">
						<span class="cbre-nav-link transition-colors duration-300"
							:class="isLightMode ? 'text-cbre-green/90' : '!text-white/90'">{{
								$t('nav.brand.pms_short')
							}}</span>
					</div>
				</div>

				<div class="flex items-center gap-2 z-20">

					<CommonLanguageSwitcher />

					<!-- Mobile User Menu -->
					<NavUserMenu :isLightMode="isLightMode" />

					<!-- Mobile Search Icon -->
					<button @click="openTextSearchPannel = !openTextSearchPannel"
						class="focus:outline-none p-1">
						<IconMagnifier
							class="w-10 h-10 transition-colors transform translate-y-[-2px]"
							:class="isLightMode ? 'text-cbre-green' : 'text-white hover:text-white/80'" />
					</button>
					<!-- Mobile Menu (Filter) Icon -->
					<button @click="openFilterPannel = !openFilterPannel"
						class="focus:outline-none p-1">
						<UIcon :name="openFilterPannel ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
							class="transition-colors" size="30"
							:class="isLightMode ? 'text-cbre-green' : 'text-white hover:text-white/80'" />
					</button>
				</div>
			</div>
		</div>

		<!-- More Menu Overlay -->
		<div class="fixed top-[8rem] left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden z-40"
			:class="openMenuMore ? 'max-h-[60rem] border-t-4 border-cbre-green' : 'max-h-0'">
			<NavMoreMenu />
		</div>

		<!-- Web Search Panel -->
		<Transition name="slide-right">
			<div v-show="isHydrationComplete && !isMobileOrTablet && openWebSearchPannel"
				class="web-search-pannel shadow-2xl z-10">
				<NavWebSearchPannel @isClosed="collapseAll" />
			</div>
		</Transition>



		<!-- Mobile Panels (Outside Menu Overlay) -->
		<!-- Search Panel -->
		<div v-if="isHydrationComplete"
			class="text-search-pannel fixed top-[8rem] left-0 w-full max-h-[60vh] overflow-y-auto bg-white shadow-md transition-all duration-300 ease-in-out z-[60] transform origin-top lg:hidden"
			:class="[
				openTextSearchPannel ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
			]">
			<NavMobileTextSearchPannel @isClosed="collapseAll" />
		</div>

		<Transition name="cbre-transition-slide-down">
			<div v-show="isHydrationComplete && openFilterPannel"
				class="filter-pannel fixed top-[8rem] right-0 w-full h-[calc(100vh-8rem)] bg-white shadow-2xl z-[40] lg:hidden">
				<NavMobileFilterPannel @isClosed="collapseAll" />
			</div>
		</Transition>


		<!-- Backdrop -->
		<div v-if="uiStore.isMenuOverlay || uiStore.isUserProfileModalOpen || uiStore.showInfoModal"
			class="fixed inset-0 top-[8rem] bg-black/40 backdrop-blur-sm z-30" @click="collapseAll"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useUiStore } from '~/stores/ui'
import { usePropertyStore } from '~/stores/property'

import { storeToRefs } from 'pinia'

const uiStore = useUiStore()
const propertyStore = usePropertyStore()
const userStore = useUserStore()

// Hydration Safety: Ensure components only render after mount
const isHydrationComplete = ref(false)
onMounted(() => {
	isHydrationComplete.value = true
})

// const device = useDevice() // Moved to Global State (App.vue -> UiStore)
const isMobileOrTablet = computed(() => isHydrationComplete.value && (uiStore.isMobile || uiStore.isTablet))
const isMobile = computed(() => isHydrationComplete.value && uiStore.isMobile)


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
	{ name: 'All Types', labelKey: 'nav.filter.options.all', value: '' },
	{ name: 'Lease', labelKey: 'nav.filter.options.lease', value: 'Lease' },
	{ name: 'Sale', labelKey: 'nav.filter.options.sale', value: 'Sale' },
	{ name: 'Sale/Lease', labelKey: 'nav.filter.options.sale_lease', value: 'Sale/Lease' }
]
const selectedTransaction = ref(transaction[0])
const openTransaction = ref(false)

const selectTransaction = (type: any) => {
	selectedTransaction.value = type
	propertyStore.updateFilter('filterTransactionType', type.value)
	openTransaction.value = false
}

// Sectors
const sectors = [
	{ name: 'All', labelKey: 'nav.filter.options.all', value: '' },
	{ name: 'Office', labelKey: 'nav.filter.options.office', value: 'Office' },
	{ name: 'Logistics', labelKey: 'nav.filter.options.logistics', value: 'Logistics' },
	{ name: 'Retail', labelKey: 'nav.filter.options.retail', value: 'Retail' },
	{ name: 'Hospital', labelKey: 'nav.filter.options.hospital', value: 'Hospital' }
]
const selectedSectors = ref<{ name: string, labelKey: string, value: string }[]>([])
const openSectors = ref(false)

const isSelectedSector = (option: { name: string }) => {
	if (option.name === 'All') return selectedSectors.value.length === 0
	return selectedSectors.value.some(s => s.name === option.name)
}
const toggleSelectedSector = (option: { name: string, labelKey: string, value: string }) => {
	if (option.name === 'All') {
		selectedSectors.value = []
	} else {
		if (isSelectedSector(option)) {
			selectedSectors.value = selectedSectors.value.filter(s => s.name !== option.name)
		} else {
			selectedSectors.value.push(option)
		}
	}
	propertyStore.updateFilter('filterSectorTypes', selectedSectors.value.map(s => s.value))
}

const selectedSectorsDisplay = computed(() => {
	const { t } = useI18n()
	if (selectedSectors.value.length === 0) return t('nav.filter.options.all')
	if (selectedSectors.value.length === 1) return t(selectedSectors.value[0]?.labelKey || '')
	return `${t(selectedSectors.value[0]?.labelKey || '')} (+${selectedSectors.value.length - 1})`
})

// SubSectors
const subsectors = [
	{ name: 'All', labelKey: 'nav.filter.options.all', value: '' },
	{ name: 'Cold Logistic', labelKey: 'nav.filter.options.subsector.cold', value: 'Cold Logistic' },
	{ name: 'Dry Logistic', labelKey: 'nav.filter.options.subsector.dry', value: 'Dry Logistic' },
	{ name: 'Mixed Logistic', labelKey: 'nav.filter.options.subsector.mixed', value: 'Mixed Logistic' },
	{ name: 'Central Business District', labelKey: 'nav.filter.options.subsector.cbd', value: 'Central Business District' }
]
const selectedSubSectors = ref<{ name: string, labelKey: string, value: string }[]>([])
const openSubSectors = ref(false)

const isSelectedSubSector = (option: { name: string }) => {
	if (option.name === 'All') return selectedSubSectors.value.length === 0
	return selectedSubSectors.value.some(s => s.name === option.name)
}
const toggleSelectedSubSector = (option: { name: string, labelKey: string, value: string }) => {
	if (option.name === 'All') {
		selectedSubSectors.value = []
	} else {
		if (isSelectedSubSector(option)) {
			selectedSubSectors.value = selectedSubSectors.value.filter(s => s.name !== option.name)
		} else {
			selectedSubSectors.value.push(option)
		}
	}
	propertyStore.updateFilter('filterSubSectorTypes', selectedSubSectors.value.map(s => s.value))
}

const selectedSubSectorsDisplay = computed(() => {
	const { t } = useI18n()
	if (selectedSubSectors.value.length === 0) return t('nav.filter.options.all')
	if (selectedSubSectors.value.length === 1) return t(selectedSubSectors.value[0]?.labelKey || '')
	return `${t(selectedSubSectors.value[0]?.labelKey || '')} (+${selectedSubSectors.value.length - 1})`
})

// More Menu
const openMobileMenu = ref(false)
const openMenuMore = ref(false)
const openWebSearchPannel = ref(false)
const openTextSearchPannel = ref(false)
const openFilterPannel = ref(false)

// Animation State (Prevent initial slideHide) - REMOVED

const collapseAll = () => {
	uiStore.isMenuOverlay = false
	openMobileMenu.value = false
	openTransaction.value = false
	openSectors.value = false
	openSubSectors.value = false
	openMenuMore.value = false
	openWebSearchPannel.value = false
	openTextSearchPannel.value = false
	openFilterPannel.value = false
	uiStore.toggleUserProfileModal(false)
}

watch([openMobileMenu, openTransaction, openSectors, openSubSectors, openMenuMore, openTextSearchPannel, openFilterPannel], ([mm, t, s, ss, m, ts, f]) => {
	uiStore.isMenuOverlay = mm || t || s || ss || m || ts || f
})

</script>

<style scoped>
.search-input {
	width: 100%;
	padding: 0.5rem 1rem;
}

.web-search-pannel {
	position: absolute;
	top: 8rem;
	right: 0;
	width: 40%;
	min-width: 40rem;
	height: calc(100vh - 8rem);
	z-index: 100;
	background-color: white;
}

.filter-pannel {
	position: absolute;
	top: 8rem;
	right: 0;
	width: 100%;
	min-width: 40rem;
	height: calc(100vh - 8rem);
	z-index: 40;
	background-color: white;
}



@media (max-width: 40rem) {

	.text-search-pannel,
	.web-search-pannel,
	.filter-pannel {
		width: 100%;
		min-width: 100%;
	}
}

/* Vue Transitions */
.slide-right-enter-active,
.slide-right-leave-active {
	transition: transform 0.5s ease-in-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
	transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
	transform: translateX(0);
}
</style>