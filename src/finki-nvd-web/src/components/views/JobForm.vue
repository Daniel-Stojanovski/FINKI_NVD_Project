<template>
  <NavBar :componentName="'Guider'" @search-query-changed="handleSearchQuery"></NavBar>
  <hr>
  <div>
    <div class="d-flex">
      <router-link :to="'/guider'" class="btn btn-outline-gray border-0 my-auto mx-3">
        <i class="bi bi-arrow-left-circle" style="font-size: 32px;"></i>
      </router-link>
      <h2 class="text-center my-2 mx-auto">Add Job</h2>
      <i class="bi bi-circle mx-4" style="font-size: 32px; color: white"></i>
    </div>
    <form>
      <div class="form-group col-md-8 mx-auto">
        <input type="text" v-model="roleName" class="form-control" id="roleName" placeholder="Job name" required>
      </div>
      <hr class="col-md-7 mx-auto">
      <div class="form-group container-scroll">
        <SubjectCheck :searchQuery="searchQuery" @update-selected-subjects="handleSelectedSubjects"></SubjectCheck>
      </div>
      <router-link :to="'/guider'">
        <button type="submit"
                class="btn btn-primary floating-add-button"
                style="font-size: 18px"
                @click="submitForm">  Finish
        </button>
      </router-link>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import SubjectCheck from "@/components/units/SubjectCheck.vue";
import NavBar from "@/components/sections/NavBar.vue";

export default {
  components: {
    NavBar,
    SubjectCheck
  },
  data() {
    return {
      roleName: '',
      searchQuery: '',
      selectedSubjects: [],
      selectedSubjectNames: [],
    };
  },
  methods: {
    handleSelectedSubjects({ selectedSubjects, selectedSubjectNames }) {
      this.selectedSubjects = selectedSubjects;
      this.selectedSubjectNames = selectedSubjectNames;
    },

    async submitForm() {
      try {
        const roleResponse = await axios.post('/api/roles', {
          role_name: this.roleName
        });
        const roleId = roleResponse.data.id;

        await axios.post('/api/roles_subjects', {
          role_id: roleId,
          subject_ids: this.selectedSubjects,
          subject_names: this.selectedSubjectNames,
        });

        this.roleName = '';
        this.selectedSubjects = [];
        this.selectedSubjectNames = [];

      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },

    handleSearchQuery(query) {
      this.searchQuery = query;
    },
  },
};
</script>

<style scoped>
.floating-add-button {
  position: fixed;
  bottom: 3vh;
  right: 2vw;
}

.container-scroll {
  width: 99.5%;
  height: 63vh;
  overflow-y: scroll;
}
</style>
