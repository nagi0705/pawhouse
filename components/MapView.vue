<template>
    <div>
        <client-only>
            <l-map v-if="isClient" :zoom="zoom" :center="center" style="height: 400px; width: 100%;">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                    name="OpenStreetMap" />

                <!-- ▼▼▼ 単一マーカーはコメントアウトして保管 ▼▼▼
                <l-marker :lat-lng="center" :icon="customIcon">
                    <l-popup>ここが中心です</l-popup>
                </l-marker>
                ▼▼▼ ここまで ▼▼▼ -->

                <!-- ▼▼▼ 複数マーカーをループ表示 ▼▼▼ -->
                <l-marker v-for="(prop, index) in properties" :key="index" :lat-lng="[prop.latitude, prop.longitude]"
                    :icon="customIcon">
                    <l-popup>
                        <!-- ポップアップ内に物件名と詳細ページへのリンクを表示 -->
                        <div>
                            <strong>{{ prop.name }}</strong><br />
                            <NuxtLink :to="`/property/${prop.id}`" class="text-blue-500 hover:underline">
                                詳細を見る
                            </NuxtLink>
                        </div>
                    </l-popup>
                </l-marker>
                <!-- ▲▲▲ ここまで複数マーカー ▲▲▲ -->
            </l-map>
        </client-only>
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { ClientOnly } from "#components";

// ▼▼▼ props を定義して複数物件を受け取れるようにする ▼▼▼
defineProps({
    // 複数の物件を格納した配列を親から受け取る
    // { id, name, latitude, longitude, ... } が想定
    properties: {
        type: Array,
        default: () => []
    },
    // マップの初期中心座標
    center: {
        type: Array,
        default: () => [35.6895, 139.6917] // 東京都
    },
    // マップの初期ズーム
    zoom: {
        type: Number,
        default: 13
    }
});

// クライアントサイドでのみ Leaflet をロード
let L;
if (process.client) {
    import("leaflet").then((leaflet) => {
        L = leaflet.default;
    });
}

// Leaflet コンポーネントの遅延ロード
const LMap = defineAsyncComponent(() => import("@vue-leaflet/vue-leaflet").then(m => m.LMap));
const LTileLayer = defineAsyncComponent(() => import("@vue-leaflet/vue-leaflet").then(m => m.LTileLayer));
const LMarker = defineAsyncComponent(() => import("@vue-leaflet/vue-leaflet").then(m => m.LMarker));
const LPopup = defineAsyncComponent(() => import("@vue-leaflet/vue-leaflet").then(m => m.LPopup));

// クライアントサイドでのみ描画するための対策
const isClient = ref(false);
onMounted(() => {
    isClient.value = true;
});

// 📌 カスタムアイコン（「📍」ピン）を使う
const customIcon = ref(null);
onMounted(() => {
    if (L) {
        // 【重要】DivIcon を使い、html に「📍」を指定
        customIcon.value = L.divIcon({
            html: '<span style="font-size: 30px; line-height: 30px;">📍</span>',
            className: "", // 不要なら空でもOK
            iconSize: [30, 30],    // アイコン全体のサイズ
            iconAnchor: [15, 30],  // アイコンの「足元」が地図の座標に合うように
            popupAnchor: [0, -30]  // ポップアップの吹き出し位置を調整
        });
    }
});
</script>