// /composables/useFavoriteProperties.js

import { ref } from "vue";

const STORAGE_KEY = "favoritePropertyIds";

// ローカルストレージのデータを読み込む関数
function loadFavoritesFromLocalStorage() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
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
  // お気に入りID一覧を管理するリアクティブ変数
  const favoriteIds = ref([]);

  // 初回読み込み時にローカルストレージから読み込み
  if (process.client) {
    favoriteIds.value = loadFavoritesFromLocalStorage();
  }

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

  // 特定の物件がお気に入りかどうか判定
  const isFavorite = (propertyId) => {
    return favoriteIds.value.includes(propertyId);
  };

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}