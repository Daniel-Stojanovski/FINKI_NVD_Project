<template>
  <div id="subjectCard" class="container">
    <div class="row">
      <div v-if="roleHasSubjects" v-for="subject in other_subjects" :key="subject.id" class="col-md-4 mb-2">
        <div class="d-flex py-3 rounded-4 border border-2">
          <div class="mx-4 m-auto justify-content-center align-items-center" style="font-size: 24px">
            <button class="p-0 border-0 bg-transparent">
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>
          <div class="card-body body-line-left">
            <div class="d-flex align-items-center">
              <h4 class="card-title"><b>{{ subject.name }}</b></h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubjectAdd",
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      subjects: [],
      role_subjects: [],
      other_subjects: [],

      roleHasSubjects: false,
    };
  },
  mounted() {
    console.log('Component SubjectAdd mounted');
    this.fetchSubjects();
    this.fetchRoleSubjects();
  },
  methods: {
    async fetchSubjects() {
      try {
        const response = await this.$axios.get('/api/subjects');
        this.subjects = response.data;

        const role_response = await this.$axios.get(`/api/roles_subjects/${this.roleId}`);
        this.role_subjects = role_response.data;

        const roleSubjectNames = this.role_subjects.map(subject => subject.subject_name);
        this.other_subjects = this.subjects.filter(subject => {
          return !roleSubjectNames.includes(subject.name);
        });
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },

    async fetchRoleSubjects() {
      try {
        const response = await this.$axios.get(`/api/roles_subjects/${this.roleId}`);
        this.role_subjects = response.data;
        this.roleHasSubjects = this.role_subjects.length > 0;
      } catch (error) {
        console.error('Error fetching role subjects:', error);
      }
    },
  },
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>