// /composables/useFavoriteProperties.js
import { ref } from "vue";

const STORAGE_KEY = "favoritePropertyIds";

// ローカルストレージのデータを読み込む関数
function loadFavoritesFromLocalStorage() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : []; // ✅ `null` ではなく `[]` を返す
    } catch (error) {
        console.error("ローカルストレージからのお気に入り読み込みに失敗:", error);
        return [];
    }
}

// ローカルストレージにデータを保存する関数
function saveFavoritesToLocalStorage(favoriteIds) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
        console.error("ローカルストレージへのお気に入り保存に失敗:", error);
    }
}

export function useFavoriteProperties() {
    // ✅ 修正: 初期値を `[]` に確実にする
    const favoriteIds = ref(loadFavoritesFromLocalStorage() || []);

    console.log("お気に入りリストの初期値:", favoriteIds.value); // ✅ デバッグ用

    // お気に入り追加
    const addFavorite = (propertyId) => {
        if (!favoriteIds.value.includes(propertyId)) {
            favoriteIds.value.push(propertyId);
            saveFavoritesToLocalStorage(favoriteIds.value);
        }
    };

    // お気に入り削除
    const removeFavorite = (propertyId) => {
        favoriteIds.value = favoriteIds.value.filter(id => id !== propertyId);
        saveFavoritesToLocalStorage(favoriteIds.value);
    };

    return {
        favoriteIds,
        addFavorite,
        removeFavorite,
        isFavorite: (propertyId) => favoriteIds.value.includes(propertyId),
    };
}