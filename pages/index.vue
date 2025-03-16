<template>
    <div>
        <h1>ペット可物件リスト</h1>
        <ul>
            <li v-for="property in properties" :key="property.id">
                {{ property.name }} - {{ property.location }} ({{ property.price }}円)
            </li>
        </ul>

        <!-- 地図コンポーネントを追加 -->
        <MapView />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase"; // Firestore のインポート
import MapView from "@/components/MapView.vue"; // 地図コンポーネントの追加

const properties = ref([]); // 物件データを格納する変数

onMounted(async () => {
    const querySnapshot = await getDocs(collection(db, "properties"));
    properties.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
});
</script>