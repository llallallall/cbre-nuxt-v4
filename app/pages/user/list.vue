<template>
    <div class="wrapper px-10 py-10">
        <div class="w-full bg-[rgba(255,255,255,0.2)] rounded-[15px] outline-none ] ">

            <div class="relative 
                        px-[2.5em] pt-[7.5em] pb-[2.5em] 
                        backdrop-blur-[25px] shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]
                        border-2 border-[rgba(255,255,255,0.4)] rounded-[15px] 
                        flex flex-col gap-5">

                <div class="absolute top-0 left-[50%] -translate-x-[50%] 
                                        px-[1.5em] py-[1.0em] md:py-[0.5em] 
                                        text-center text-cbre_primary_3 text-[1.5em] 
                                        rounded-[0_0_20px_20px] 
                                        bg-[rgba(230,234,234,1)]
                                        before:content-[''] before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:bg-transparent  before:shadow-[15px_0_0_0_rgba(230,234,234,1)]
                                        after:content-[''] after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:bg-transparent  after:shadow-[-15px_0_0_0_rgba(230,234,234,1)]
                                        ">
                    List of Users ({{ userStore.allUsers.length }})
                </div>
                <div class="flex gap-5 justify-start items-center font-calibre text-white text-lg mb-2">
                    <span>search field:</span>
                    <select v-model="searchField" class="bg-transparent text-white border border-white/30 rounded px-2">
                        <option value="name" class="text-black" selected>Name</option>
                        <option value="email" class="text-black">Email</option>
                    </select>

                    <span>search value: </span>
                    <input type="text" v-model="searchValue"
                        class="bg-transparent border-slate-300 border-0 border-b-2  outline-none px-2 py-0 text-white">
                </div>

                <UTable :columns="columns" :rows="filteredItems">
                    <template #operation-data="{ row }">
                        <div class="operation-wrapper flex gap-2">
                            <UIcon name="i-heroicons-trash"
                                class="operation-icon w-5 h-5 text-red-400 cursor-pointer hover:text-red-600"
                                @click="deleteUser(row.id)" />
                            <UIcon name="i-heroicons-pencil-square"
                                class="operation-icon w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-600"
                                @click="editItem(row.id)" />
                        </div>
                    </template>
                </UTable>

                <!-- Pagination controls if needed, UTable has built-in pagination if configured, or manual -->
                <div class="flex justify-center mt-4">
                    <UPagination v-model="currentPage" :page-count="totalPages" :total="userStore.allUsers.length" />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

import { useAppToast } from '~/composables/useAppToast';

definePageMeta({
    middleware: "auth",
    layout: 'admin-layout',
});

const { showToast } = useAppToast();
const userStore = useUserStore();
const router = useRouter();

const columns: any[] = [
    { label: "Name", key: "name", sortable: true },
    { label: "Email", key: "email", sortable: true },
    { label: "Role", key: "role", sortable: true },
    { label: "Company", key: "profile.company", sortable: true },
    { label: "Branch", key: "profile.branch", sortable: true },
    { label: "Department", key: "profile.department" },
    { label: "Title", key: "profile.title" },
    { label: "Operation", key: "operation" },
];

const searchField = ref("name");
const searchValue = ref("");

// Pagination state
const currentPage = ref(1);
const rowsPerPage = ref(10);

const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const filteredItems = computed(() => {
    let items = userStore.allUsers;

    if (searchValue.value) {
        items = items.filter((item: any) => {
            const field = searchField.value;
            const val = getNestedValue(item, field);
            return val && String(val).toLowerCase().includes(searchValue.value.toLowerCase());
        });
    }

    const start = (currentPage.value - 1) * rowsPerPage.value;
    const end = start + rowsPerPage.value;
    return items.slice(start, end);
});

const totalPages = computed(() => {
    let items = userStore.allUsers;
    if (searchValue.value) {
        items = items.filter((item: any) => {
            const field = searchField.value;
            const val = getNestedValue(item, field);
            return val && String(val).toLowerCase().includes(searchValue.value.toLowerCase());
        });
    }
    return Math.ceil(items.length / rowsPerPage.value);
});


const deleteUser = async (id: string) => {
    // Implement delete logic
    console.log("Delete user", id);
    showToast('Delete feature not implemented yet', 'warning');
};

const editItem = (propertyId: string) => {
    // router.push({ path: "/property/modify/" + propertyId }) // This was for property, user edit might be different
    // Assuming user edit page exists or modal
    console.log("Edit user", propertyId);
    showToast('Edit feature not implemented yet', 'warning');
};

</script>

<style scoped>
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 100;
}

.operation-wrapper {
    display: flex;
    align-items: center;
    justify-items: center;
}
</style>
