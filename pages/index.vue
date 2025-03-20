<!-- /pages/index.vue -->
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
                            property.price?.toLocaleString() }}
                    </NuxtLink>
                    <p>ペット可: {{ property.petsAllowed ? property.petsAllowed.join(", ") : "情報なし" }}</p>
                    <p>設備: {{ property.features ? property.features.join(", ") : "情報なし" }}</p>
                </li>
            </ul>

            <p v-else>該当する物件がありません。</p>
        </UCard>

        <!-- ✅ 修正後の新規物件登録ボタン -->
        <UCard class="mt-4">
            <NuxtLink to="/property/new" class="btn btn-primary">
                新規物件を登録
            </NuxtLink>
        </UCard>
    </UContainer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

const properties = ref([]);
const selectedPet = ref("");

// Firestore から物件データを取得
onMounted(async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        properties.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                petsAllowed: Array.isArray(data.petsAllowed) ? data.petsAllowed : []
            };
        });

        console.log("✅ Firestoreから取得したデータ:", properties.value);
    } catch (error) {
        console.error("データ取得エラー:", error);
    }
});

// フィルタリングされた物件リスト
const filteredProperties = computed(() => {
    if (!selectedPet.value) {
        return properties.value;
    }
    return properties.value.filter(property =>
        property.petsAllowed.includes(selectedPet.value)
    );
});
</script>

<style scoped>
/* ✅ 新規登録ボタンのスタイル */
.btn-primary {
    background: #2563eb;
    /* Nuxt UI primary */
    color: white;
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: background 0.3s ease, transform 0.2s ease;
    text-decoration: none;
    /* ✅ 下線を削除 */
    display: inline-block;
    /* ✅ ボタンの幅をテキストサイズに調整 */
}

.btn-primary:hover {
    background: #1e40af;
    /* 青 (ホバー時) */
    transform: scale(1.05);
    /* 軽い拡大 */
}
</style>