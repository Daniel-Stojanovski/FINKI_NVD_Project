<template>
  <nav class="navbar navbar-light bg-white"
       :class="{ 'mt-3' : componentName === 'Home'}">
    <div class="container-fluid d-flex col-md-12">
      <div v-if="componentName === 'Guider' || componentName === 'JobBoard'"
           class="col-md-2 text-center">
        <router-link :to="'/home'">
          <img src="https://www.finki.ukim.mk/Content/dataImages/downloads/logo-large-500x500_2.png"
               width="29%"
               height="29%"
               alt="IO">
        </router-link>
      </div>

      <div class="d-flex col-md-6 input-group-text p-0 px-2 bg-white rounded-5 search-container"
           :class="{ 'col-md-8' : componentName === 'Home' }"
           style="color: #bebebe">
        <i class="bi bi-search px-1"
           style="font-size: 16px;">
        </i>
        <input
            type="search"
            class="flex-grow-1 p-1 rounded-5"
            :placeholder="componentName === 'Guider' ? 'Search jobs' : 'Search for subjects'"
            aria-label="Search"
            v-model="searchQuery"
            @input="emitSearchQuery"
        />
      </div>

      <RouteSwitch :componentName="componentName"></RouteSwitch>
      <LogButton></LogButton>
    </div>
  </nav>
</template>

<script>
import RouteSwitch from "@/components/units/RouteSwitch.vue";
import { useRouter } from "vue-router";
import LogButton from "@/components/units/LogButton.vue";

export default {
  name: "NavBar",
  components: {
    LogButton,
    RouteSwitch,
  },
  props: {
    componentName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    emitSearchQuery() {
      this.$emit('search-query-changed', this.searchQuery);
    },
  },
};
</script>

<style>
input {
  border: none;
  outline: none;
  box-shadow: none;
}
.search-container:has(> input:focus ),
.search-container:has(> input:hover ){
  border-width: 3px;
  border-color: #0D6EFD;
  color: #0D6EFD;
}
</style>
