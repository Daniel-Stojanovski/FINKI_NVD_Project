<template>
  <div v-if="componentName === 'Home'"
       class="d-flex align-items-center">
    <router-link :to="'/guider'">
      <button class="btn btn-outline-secondary align-items-center">
        Guide
      </button>
    </router-link>
    <span class="mx-1"></span>
    <router-link :to="'/home'">
      <button class="btn btn-primary align-items-center">
        Forum
      </button>
    </router-link>
  </div>

  <div v-else class="d-flex align-items-center">
    <span class="mx-3"></span>
    <router-link :to="'/guider'">
      <button class="btn btn-primary align-items-center">
        Guide
      </button>
    </router-link>
    <span class="mx-1"></span>
    <router-link :to="'/home'">
      <button class="btn btn-outline-secondary align-items-center">
        Forum
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "RouteSwitch",
  props: {
    componentName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    };
  },
  methods: {
  }
}
</script>

<style>
</style>