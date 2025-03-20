<!-- /pages/property/[id].vue -->
<template>
    <UContainer>
        <UCard v-if="property">
            <h1 class="text-2xl font-bold">{{ property.name }}</h1>
            <p class="text-gray-600">{{ property.location }}</p>
            <p class="mt-2 text-lg font-semibold">
                価格: ¥{{ property.price?.toLocaleString() }}
            </p>

            <h2 class="mt-4 text-xl font-bold">ペット可</h2>
            <p>{{ property.petsAllowed.join(", ") }}</p>

            <h2 class="mt-4 text-xl font-bold">設備</h2>
            <p>{{ property.features.join(", ") }}</p>

            <!-- 建築仕様・ペット向け設備の詳細 -->
            <h2 class="mt-4 text-xl font-bold">建築仕様・ペット向け設備の詳細</h2>
            <ul v-if="property.features?.length" class="list-disc list-inside">
                <li v-for="(item, index) in property.features" :key="index">{{ item }}</li>
            </ul>
            <p v-else>建築仕様・ペット向け設備の情報はありません</p>

            <!-- ✅ お気に入りボタン -->
            <div class="mt-4">
                <button class="btn btn-favorite" :class="isFavorite(propertyId) ? 'active' : ''"
                    @click="toggleFavorite(propertyId)">
                    <span v-if="isFavorite(propertyId)">❤️ お気に入り中</span>
                    <span v-else>♡ お気に入り追加</span>
                </button>

                <p class="mt-2 text-sm text-gray-500">
                    現在のお気に入り登録数: {{ favoriteIds?.length || 0 }}
                </p>
            </div>
        </UCard>
        <p v-else>物件情報を取得中...</p>
    </UContainer>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useFavoriteProperties } from "@/components/useFavoriteProperties.js";

// お気に入り機能
const { favoriteIds, addFavorite, removeFavorite, isFavorite } = useFavoriteProperties();
const route = useRoute();
const propertyId = computed(() => route.params.id);
const property = ref(null);

// 物件データを取得
onMounted(async () => {
    console.log("Detail page propertyId:", propertyId.value);
    try {
        const docRef = doc(db, "properties", propertyId.value);
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

// お気に入りのトグル
const toggleFavorite = (id) => {
    if (isFavorite(id)) {
        removeFavorite(id);
    } else {
        addFavorite(id);
    }
};
</script>

<style scoped>
/* ✅ ボタンの共通スタイル */
.btn {
    padding: 8px 16px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: background 0.3s ease;
}

/* ✅ お気に入りボタン */
.btn-favorite {
    background: #6b7280;
    /* グレー */
    color: white;
}

.btn-favorite.active {
    background: #ef4444;
    /* 赤 */
}

.btn-favorite:hover {
    background: #dc2626;
    /* 赤 (ホバー時) */
}
</style>