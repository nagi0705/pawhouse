<!-- /pages/property/new.vue -->
<template>
    <UContainer>
        <UCard>
            <h1 class="text-2xl font-bold mb-4">新しい物件を登録</h1>

            <!-- 物件名 -->
            <div class="mb-4">
                <label class="block font-medium">物件名</label>
                <input v-model="name" type="text" class="border p-2 w-full" placeholder="マンションA など" />
            </div>

            <!-- 所在地（住所） -->
            <div class="mb-4">
                <label class="block font-medium">所在地（テキスト）</label>
                <input v-model="location" type="text" class="border p-2 w-full" placeholder="東京都渋谷区など" />
            </div>

            <!-- 価格 -->
            <div class="mb-4">
                <label class="block font-medium">価格 (円)</label>
                <input v-model.number="price" type="number" class="border p-2 w-full" placeholder="120000 など" />
            </div>

            <!-- ペット可 (チェックボックスで複数選択) -->
            <div class="mb-4">
                <label class="block font-medium mb-1">ペット可（複数選択可）</label>
                <div>
                    <label class="mr-4">
                        <input type="checkbox" value="犬" v-model="selectedPets" />
                        犬
                    </label>
                    <label class="mr-4">
                        <input type="checkbox" value="猫" v-model="selectedPets" />
                        猫
                    </label>
                    <label class="mr-4">
                        <input type="checkbox" value="鳥" v-model="selectedPets" />
                        鳥
                    </label>
                    <label class="mr-4">
                        <input type="checkbox" value="エキゾチック" v-model="selectedPets" />
                        エキゾチック
                    </label>
                    <label class="mr-4">
                        <input type="checkbox" value="その他" v-model="selectedPets" />
                        その他
                    </label>
                </div>
            </div>

            <!-- 設備 (カンマ区切り入力を配列に変換) -->
            <div class="mb-4">
                <label class="block font-medium">設備（カンマ区切り）</label>
                <input v-model="featuresInput" type="text" class="border p-2 w-full"
                    placeholder="バルコニー,エレベーター,専用庭 など" />
                <p class="text-sm text-gray-500 mt-1">
                    カンマで区切って入力してください。<br />
                    例: 防臭床,滑り止め床,バリアフリー など
                </p>
            </div>

            <!-- ✅ 修正後の登録ボタン -->
            <button class="btn btn-primary" @click="createProperty">登録</button>

            <!-- 成功メッセージ -->
            <p v-if="message" class="mt-2 text-green-500">{{ message }}</p>
        </UCard>
    </UContainer>
</template>

<script setup>
import { ref } from "vue";
import { db } from "@/utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

// フォーム入力用リアクティブ変数
const name = ref("");
const location = ref("");
const price = ref(null);
const selectedPets = ref([]);
const featuresInput = ref("");
const message = ref("");

const router = useRouter();

/**
 * Nominatim (OpenStreetMap) を使って住所をジオコーディングし、 { lat, lng } を返す
 */
async function geocodeAddressWithNominatim(address) {
    const encoded = encodeURIComponent(address);

    // Nominatimの公共サーバーを呼び出す
    // User-Agent ヘッダーを指定するのが推奨
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`,
        {
            headers: {
                "User-Agent": "Nuxt3 App (example@example.com)"
            }
        }
    );

    const data = await response.json();

    // data は配列で返ってくる。先頭要素を使う
    if (Array.isArray(data) && data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;
        return { lat, lng };
    } else {
        throw new Error("ジオコーディングに失敗しました");
    }
}

/**
 * 「登録」ボタンを押した時の処理
 */
async function createProperty() {
    try {
        // 1. 住所欄から緯度経度を自動取得 (Nominatim)
        const { lat, lng } = await geocodeAddressWithNominatim(location.value);

        // 2. カンマ区切りの設備を配列に変換
        const featuresArray = featuresInput.value
            ? featuresInput.value.split(",").map(item => item.trim())
            : [];

        // 3. Firestore に書き込む
        const docRef = await addDoc(collection(db, "properties"), {
            name: name.value,
            location: location.value,
            price: price.value,
            // チェックボックスで選択したペット可を配列で保存
            petsAllowed: selectedPets.value,
            // 設備の配列
            features: featuresArray,
            // 取得した緯度経度を数値化して保存
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
        });

        message.value = "新しい物件を登録しました！";
        console.log("✅ 新規登録成功:", docRef.id);

        // 2秒後にトップページへ遷移
        setTimeout(() => {
            router.push("/");
        }, 2000);

    } catch (error) {
        console.error("登録エラー:", error);
        message.value = "ジオコーディング or 登録に失敗しました。";
    }
}
</script>

<style scoped>
/* ✅ ボタンの共通スタイル */
.btn {
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: background 0.3s ease, transform 0.2s ease;
}

/* ✅ 登録ボタンのスタイル */
.btn-primary {
    background: #2563eb;
    /* Nuxt UI primary */
    color: white;
}

.btn-primary:hover {
    background: #1e40af;
    /* 青 (ホバー時) */
    transform: scale(1.05);
    /* 軽い拡大 */
}
</style>