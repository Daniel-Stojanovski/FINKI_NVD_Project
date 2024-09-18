<template>
  <div id="jobCard" class="container">
    <div class="row">
      <div v-for="role in filteredRoles" :key="role.id" class="col-md-4 mb-0">
        <router-link :to="'/guide/'+role.id" style="text-decoration: none;">
          <div class="card card-hover my-2 rounded-4 border-2">
            <div class="card-body btn border-0"> <!-- @click="openJobBoard(role.id)"> -->
              <div class="d-flex align-items-center body-line-left">
                <i class="bi bi-briefcase-fill"></i>
                <h4 class="px-3 py-2 my-auto fw-bolder">{{ role.role_name }}</h4>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobCard",
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roles: [],
    };
  },
  mounted() {
    console.log('Component JobCard mounted');
    this.fetchRoles();
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await this.$axios.get('/api/roles');
        this.roles = response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },
  },
  computed: {
    filteredRoles() {
      if (!this.searchQuery) return this.roles;

      const query = this.searchQuery.toLowerCase();

      return this.roles.filter(role =>
          role.role_name.toLowerCase().includes(query)
      );
    }
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

.card-hover:hover {
  background-color: #0D6EFD;
}

.card-hover:hover * {
  color: white;
  border-color: white;
}
</style>