<template>
    <UContainer>
        <UCard>
            <h1 class="text-2xl font-bold mb-4">ペット可物件リスト</h1>

            <!-- 🔍 フィルター UI（ペットの種類選択） -->
            <label for="pet-filter" class="block font-medium">ペットの種類で絞り込み:</label>
            <select id="pet-filter" v-model="selectedPet" class="mb-4 p-2 border rounded">
                <option value="">すべて</option>
                <option value="犬">犬</option>
                <option value="猫">猫</option>
                <option value="鳥">鳥</option>
                <option value="エキゾチック">エキゾチック</option>
                <option value="その他">その他</option>
            </select>

            <ul v-if="filteredProperties.length">
                <li v-for="property in filteredProperties" :key="property.id" class="border-b py-2">
                    <NuxtLink :to="`/property/${property.id}`" class="text-blue-500 hover:underline">
                        <strong>{{ property.name }}</strong> - {{ property.location }} - ¥{{
                            property.price.toLocaleString() }}
                    </NuxtLink>
                    <p>ペット可: {{ property.petsAllowed ? property.petsAllowed.join(", ") : "情報なし" }}</p>
                    <p>設備: {{ property.features ? property.features.join(", ") : "情報なし" }}</p>

                    <!-- 🏷 お気に入りボタンの追加 -->
                    <button class="ml-4 px-2 py-1 border rounded text-sm" @click="toggleFavorite(property.id)">
                        {{ isFavorite(property.id) ? "お気に入り解除" : "お気に入り追加" }}
                    </button>
                </li>
            </ul>

            <p v-else>該当する物件がありません。</p>
        </UCard>

        <!-- 地図コンポーネントを追加 -->
        <MapView />
    </UContainer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import MapView from "@/components/MapView.vue"; // 地図コンポーネントの追加

// 🔹 お気に入り機能を利用するための composable を読み込み
//    (実際にファイルが "/components/useFavoriteProperties.js" にある場合)
import { useFavoriteProperties } from "@/components/useFavoriteProperties.js";

// 🔹 お気に入り機能用の関数・変数を取得
const { favoriteIds, addFavorite, removeFavorite, isFavorite } = useFavoriteProperties();

const properties = ref([]); // 物件データ
const selectedPet = ref(""); // 選択されたペットの種類

// 🔹 Firestore から物件データを取得
onMounted(async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        properties.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                petsAllowed: Array.isArray(data.petsAllowed) ? data.petsAllowed : [] // 🔹 null 回避
            };
        });

        console.log("✅ Firestoreから取得したデータ:", properties.value);
    } catch (error) {
        console.error("データ取得エラー:", error);
    }
});

// 🔹 フィルタリングされた物件リスト
const filteredProperties = computed(() => {
    if (!selectedPet.value) {
        return properties.value;
    }
    return properties.value.filter(property =>
        property.petsAllowed.includes(selectedPet.value)
    );
});

// 🔹 お気に入り追加/削除を切り替える関数
const toggleFavorite = (propertyId) => {
    if (isFavorite(propertyId)) {
        removeFavorite(propertyId);
    } else {
        addFavorite(propertyId);
    }
};
</script>