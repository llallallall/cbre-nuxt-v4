                </div>
                <div class="ml-[10px] h-[30px] pt-[8px]">
                    <span v-if="isDesktop" class="whitespace-nowrap">{{ $t('app_title') }}</span>
                    <span v-else class="whitespace-nowrap">{{ $t('pms_short') }}</span>
                </div>
            </div>

            <!-- Right Menu -->
            <div id="right-menu" class="flex items-center z-20 h-full gap-2">

                <!-- Home Button -->
                <UButton to="/" variant="ghost" color="neutral" class="hover:text-cbre-green">
                    <UIcon name="i-heroicons-home" class="w-5 h-5" />
                    <span v-if="isDesktop">{{ $t('home') }}</span>
                </UButton>

                <!-- Previous Property -->
                <UButton variant="ghost" color="neutral" class="hover:text-cbre-green" :disabled="!previousPropertyId"
                    :title="previousPropertyId ? $t('previous_property') : $t('no_previous_property')"
                    @click="goPrevious">
                    <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
                    <span v-if="isDesktop">{{ $t('previous') }}</span>
                </UButton>

                <!-- Next Property -->
                <UButton variant="ghost" color="neutral" class="hover:text-cbre-green" :disabled="!nextPropertyId"
                    :title="nextPropertyId ? $t('next_property') : $t('no_next_property')" @click="goNext">
                    <span v-if="isDesktop">{{ $t('next') }}</span>
                    <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
                </UButton>

                <div class="h-8 w-[1px] bg-gray-200 mx-2"></div>

                <!-- User Profile / Login -->
                <div v-if="loggedIn" class="flex items-center gap-3">
                    <UDropdownMenu :items="userDropdownItems" :popper="{ placement: 'bottom-end' }">
                        <UAvatar :src="user?.image || '/images/avatar/avatar-placeholder.png'"
                            :alt="user?.name || 'User'" class="cursor-pointer border border-gray-200" />
                    </UDropdownMenu>
                </div>

                <div v-else>
                    <UButton :to="'/login'" color="primary" variant="solid" size="sm">
                        {{ $t('login') }}
                    </UButton>
                </div>
            </div>
        </div>

        <main class="fixed top-[80px] w-full h-[calc(100vh-80px)]">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
// import { storeToRefs } from 'pinia';

// Modules
const { t } = useI18n();
const { isDesktop } = useDevice();
const { loggedIn, user, clear } = useUserSession();
const router = useRouter();
const route = useRoute();

// Stores
// const propertyStore = usePropertyStore(); // Assuming this store exists and is correctly typed
// const { previousPropertyId, nextPropertyId } = storeToRefs(propertyStore);

// Mocking property store for now as it might not be fully migrated or available in context
// Replace with actual store usage when ready
const previousPropertyId = ref<string | null>(null);
const nextPropertyId = ref<string | null>(null);

// SEO
useHead({
    title: (route.meta.title as string) || 'CBRE PMS',
    meta: [
        { property: 'title', content: `CBRE PMS - ${route.meta.title || 'Home'}` },
        { property: 'og:title', content: `CBRE PMS - ${route.meta.title || 'Home'}` },
    ]
});

// User Dropdown Items
const userDropdownItems = computed(() => [
    [{
        label: user.value?.name || 'User',
        slot: 'account',
        disabled: true
    }],
    [{
        label: t('logout'),
        icon: 'i-heroicons-arrow-left-on-rectangle',
        click: handleLogout
    }]
]);

// Actions
const goPrevious = () => {
    if (previousPropertyId.value) {
        // propertyStore.setAssetNav(previousPropertyId.value);
        router.push({ path: "/property/" + previousPropertyId.value });
    }
}

const goNext = () => {
    if (nextPropertyId.value) {
        // propertyStore.setAssetNav(nextPropertyId.value);
        router.push({ path: "/property/" + nextPropertyId.value });
    }
}

const handleLogout = async () => {
    // await clear(); // Commented out for safety
    // navigateTo('/login');
    console.log('Logout clicked - Logic commented out for safety');
};
</script>