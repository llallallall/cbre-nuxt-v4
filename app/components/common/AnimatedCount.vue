<template>
  <span>{{ displayString }}</span>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps<{
  target: number;
  duration?: number;
  decimals?: number;
}>();

const currentValue = ref(0);

const displayString = computed(() => {
    return currentValue.value.toLocaleString(undefined, {
        minimumFractionDigits: props.decimals || 0,
        maximumFractionDigits: props.decimals || 0
    });
});

const animate = () => {
  const start = 0;
  const end = props.target;
  const duration = props.duration || 1500;
  const startTime = performance.now();

  const update = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    
    currentValue.value = start + (end - start) * ease;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
       currentValue.value = end;
    }
  };

  requestAnimationFrame(update);
};

onMounted(() => {
  if (props.target > 0) {
      animate();
  }
});

watch(() => props.target, (newVal) => {
    animate();
});
</script>
