<template>
    <UContainer>
        <UCard>
            <h1 class="text-2xl font-bold">ペット可物件リスト</h1>

            <ul v-if="properties.length">
                <li v-for="property in properties" :key="property.id" class="border-b py-2">
                    <NuxtLink :to="`/property/${property.id}`" class="text-blue-500 hover:underline">
                        <strong>{{ property.name }}</strong> - {{ property.location }} - ¥{{
                            property.price.toLocaleString() }}
                    </NuxtLink>
                    <p>ペット可: {{ property.petsAllowed.join(', ') }}</p>
                    <p>設備: {{ property.features.join(', ') }}</p>
                </li>
            </ul>

            <p v-else>物件情報を読み込み中...</p>
        </UCard>

        <!-- 地図コンポーネントを追加 -->
        <MapView />
    </UContainer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import MapView from "@/components/MapView.vue"; // 地図コンポーネントの追加

const properties = ref([]);

onMounted(async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        properties.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("データ取得エラー:", error);
    }
});
</script>