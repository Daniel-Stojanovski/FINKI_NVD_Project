<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <Sidebar></Sidebar>
        <!-- Main Content -->
        <div class="col-md-10 main-content">
          <NavBar :componentName="'Home'" @search-query-changed="handleSearchQuery"></NavBar>
          <hr class="mt-3 mb-2">
          <div id="main-view-discussions">
            <Discussion :searchQuery="searchQuery"></Discussion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Discussion from "@/components/units/Discussion.vue";
import Sidebar from "@/components/sections/Sidebar.vue";
import NavBar from "@/components/sections/NavBar.vue";

export default {
  name: "Home",
  components: {
    NavBar,
    Discussion,
    Sidebar,
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    handleSearchQuery(query) {
      this.searchQuery = query;
    },
  },
};
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #e5e5e5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #bebebe;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0D6EFD;
}

#main-view-discussions {
  height: 86vh;
  overflow-y: auto;
}
input {
  border: none;
  outline: none;
  box-shadow: none;
}
</style>
