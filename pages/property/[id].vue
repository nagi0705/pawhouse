<template>
    <UContainer>
        <UCard v-if="property">
            <h1 class="text-2xl font-bold">{{ property.name }}</h1>
            <p class="text-gray-600">{{ property.location }}</p>
            <p class="mt-2 text-lg font-semibold">価格: ¥{{ property.price.toLocaleString() }}</p>

            <h2 class="mt-4 text-xl font-bold">ペット可</h2>
            <p>{{ property.petsAllowed.join(", ") }}</p>

            <h2 class="mt-4 text-xl font-bold">設備</h2>
            <p>{{ property.features.join(", ") }}</p>

            <!-- 建築仕様・ペット向け設備の詳細をリスト表示（追加部分） -->
            <h2 class="mt-4 text-xl font-bold">建築仕様・ペット向け設備の詳細</h2>
            <ul v-if="property.features && property.features.length" class="list-disc list-inside">
                <li v-for="(item, index) in property.features" :key="index">
                    {{ item }}
                </li>
            </ul>
            <p v-else>建築仕様・ペット向け設備の情報はありません</p>

            <!-- 地図コンポーネントを表示 -->
            <MapView :center="[property.latitude, property.longitude]" />
        </UCard>
        <p v-else>物件情報を取得中...</p>
    </UContainer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import MapView from "@/components/MapView.vue";

const route = useRoute();
const property = ref(null);

onMounted(async () => {
    try {
        const docRef = doc(db, "properties", route.params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            property.value = docSnap.data();
        } else {
            console.error("物件が見つかりません");
        }
    } catch (error) {
        console.error("データ取得エラー:", error);
    }
});
</script>