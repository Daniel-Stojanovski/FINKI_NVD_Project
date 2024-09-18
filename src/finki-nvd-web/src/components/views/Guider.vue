<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <!-- Main Content -->
        <div class="col-md-12 main-content">
          <NavBar :componentName="'Guider'" @search-query-changed="handleSearchQuery"></NavBar>
          <hr class="my-0">
          <div class="mt-2" id="main-view-subjects">
            <JobCard :searchQuery="searchQuery"></JobCard>
          </div>
          <router-link :to="'/add'" >
            <AddButton v-show="isLogged"></AddButton>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JobCard from "@/components/units/JobCard.vue";
import AddButton from "@/components/units/AddButton.vue";
import NavBar from "@/components/sections/NavBar.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default {
  name: "Guider",
  components: {
    AddButton,
    JobCard,
    NavBar,
  },
  data() {
    return {
      searchQuery: '',
      isLogged: false,
    };
  },
  mounted() {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      this.isLogged = !!user;
    });
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
#app {
  height: 100vh;
  overflow-y: hidden;
}

#main-view-subjects {
  height: 80vh;
  overflow-y: auto;
}

input {
  border: none;
  outline: none;
  box-shadow: none;
}

.floating-add-button {
  position: fixed;
  bottom: 3vh;
  right: 2.5vw;
}
</style>
