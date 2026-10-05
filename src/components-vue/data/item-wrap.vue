<template>
  <div class="item_wrap_card">
    <div class="card_corner top_left"></div>
    <div class="card_corner top_right"></div>
    <div class="card_corner bottom_left"></div>
    <div class="card_corner bottom_right"></div>
    
    <div class="scan_light_bar"></div>

    <div class="item_title_box">
      <div class="title_tag_dot"></div>
      <span class="title_text">{{ title }}</span>
      <div class="title_deco_dots">
        <span></span><span></span><span></span>
      </div>
      <div class="title_right_slot">
        <slot name="sub" />
      </div>
    </div>
    
    <div class="item_content_box">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ""
  }
})
</script>

<style scoped lang="scss">
.item_wrap_card {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(8, 24, 52, 0.72) 0%, rgba(4, 12, 30, 0.85) 100%);
  border: 1px solid rgba(0, 229, 255, 0.28);
  border-radius: 6px;
  box-shadow: 0 0 20px rgba(0, 160, 255, 0.12) inset, 0 8px 24px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  .card_corner {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 2;

    &.top_left {
      top: 0;
      left: 0;
      border-top: 2px solid #00f0ff;
      border-left: 2px solid #00f0ff;
    }
    &.top_right {
      top: 0;
      right: 0;
      border-top: 2px solid #00f0ff;
      border-right: 2px solid #00f0ff;
    }
    &.bottom_left {
      bottom: 0;
      left: 0;
      border-bottom: 2px solid #00f0ff;
      border-left: 2px solid #00f0ff;
    }
    &.bottom_right {
      bottom: 0;
      right: 0;
      border-bottom: 2px solid #00f0ff;
      border-right: 2px solid #00f0ff;
    }
  }

  .scan_light_bar {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00f0ff, transparent);
    animation: scanAnim 4s ease-in-out infinite;
    z-index: 3;
  }
}

@keyframes scanAnim {
  0% { left: -50%; }
  50%, 100% { left: 100%; }
}

.item_title_box {
  height: 42px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 16px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 110, 255, 0.05) 50%, transparent 100%);
  border-bottom: 1px solid rgba(0, 229, 255, 0.22);
  flex-shrink: 0;

  .title_tag_dot {
    width: 8px;
    height: 8px;
    background: #00f0ff;
    border-radius: 50%;
    box-shadow: 0 0 10px #00f0ff, 0 0 16px rgba(0, 240, 255, 0.8);
    margin-right: 10px;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: -3px;
      left: -3px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid rgba(0, 240, 255, 0.4);
      animation: pulseDot 2s infinite ease-out;
    }
  }

  .title_text {
    font-size: 15px;
    font-weight: 700;
    color: #f0f7ff;
    letter-spacing: 1.5px;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
  }

  .title_deco_dots {
    display: flex;
    gap: 4px;
    margin-left: 12px;

    span {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: rgba(0, 229, 255, 0.4);
    }
  }

  .title_right_slot {
    margin-left: auto;
  }
}

@keyframes pulseDot {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

.item_content_box {
  flex: 1;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 8px 12px;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
