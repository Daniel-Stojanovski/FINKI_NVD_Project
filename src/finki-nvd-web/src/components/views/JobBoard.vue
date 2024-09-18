<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <!-- Main Content -->
        <div class="col-md-12 main-content">
          <NavBar :componentName="'JobBoard'" @search-query-changed="handleSearchQuery"></NavBar>
          <hr class="my-0">
          <div class="d-flex py-2 user-select-none">
            <router-link :to="'/guider'" class="btn btn-outline-gray border-0 my-auto">
              <i class="bi bi-arrow-left-circle" style="font-size: 32px;"></i>
            </router-link>
            <h2 class="mx-auto my-auto "> {{ findObject(this.roles, 'role_name') }}</h2>
          </div>
          <hr class="my-0">
          <div class="mt-3" id="main-view-subjects">
            <SubjectCard :searchQuery="searchQuery" :roleId="id"></SubjectCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubjectCard from "@/components/units/SubjectCard.vue";
import NavBar from "@/components/sections/NavBar.vue";

export default {
  name: "JobBoard",
  props: {
    id: String,
  },
  // props: ['id'],
  components: {
    NavBar,
    SubjectCard,
  },
  data() {
    return {
      searchQuery: '',
      roles: [],
    };
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    handleSearchQuery(query) {
      this.searchQuery = query;
    },

    async fetchRoles() {
      try {
        const response = await this.$axios.get('/api/roles');
        // console.log(response);
        this.roles = response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },

    findObject(list, param) {
      if(list && param != null) {
        const object = list.find(element => element.id == this.id);
        return object ? object[param] : '';
      }
      else {
        const object = list.find(element => element.id == this.id);
        return object || '';
      }
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

#main-view-subjects {
  height: 85vh;
  overflow-y: auto;
}

input {
  border: none;
  outline: none;
  box-shadow: none;
}
</style>