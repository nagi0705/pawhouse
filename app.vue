<!-- /pawhouse/app.vue -->
<template>
  <div class="app-background">
    <UContainer>
      <UCard>
        <NuxtPage />
      </UCard>
    </UContainer>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
</script>

<style>
/* ✅ クールモダンなグラデーション背景 */
.app-background {
  background: linear-gradient(to bottom, #cbd5e1, #64748b);
  min-height: 100vh;
  /* ページ全体をカバー */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>