<template>
  <div class="floating-add-button">
    <button class="btn btn-primary btn-lg">
      <i class="bi bi-plus" style="font-size: 30px"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "AddButton"
}
</script>

<style scoped>
.floating-add-button {
  position: fixed;
  bottom: 3vh;
  right: 2vw;
}
</style>