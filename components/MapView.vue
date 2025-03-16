<template>
    <div>
        <client-only>
            <l-map v-if="isClient" :zoom="zoom" :center="center" style="height: 400px; width: 100%;">
                <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                    name="OpenStreetMap" />
                <l-marker :lat-lng="center" :icon="customIcon">
                    <l-popup>ここが中心です</l-popup>
                </l-marker>
            </l-map>
        </client-only>
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { ClientOnly } from "#components";

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

// 地図の初期設定
const zoom = ref(13);
const center = ref([35.6895, 139.6917]); // 東京都の中心

// マーカーアイコンを明示的に指定（クライアントサイドでのみ設定）
const customIcon = ref(null);
onMounted(() => {
    if (L) {
        customIcon.value = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            shadowSize: [41, 41],
        });
    }
});
</script>