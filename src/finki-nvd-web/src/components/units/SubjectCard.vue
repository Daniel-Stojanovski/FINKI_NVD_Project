<template>
  <div id="subjectCard" class="container  user-select-none">
    <div class="row">
      <div v-for="subject in filteredSubjects" :key="subject.id" class="col-md-4 mb-2">
        <div class="d-flex py-3 px-2 rounded-4 border border-2">
          <div class="mx-4 m-auto justify-content-center align-items-center" style="font-size: 24px">
            <i class="bi bi-arrow-up-circle" v-show="isLogged" @click="vote(subject.id, 1)"></i>
            <div class="d-flex">
              <p class="p-1 my-auto">{{ getVoteCount(subject.id) }}</p>
            </div>
            <i class="bi bi-arrow-down-circle" v-show="isLogged" @click="vote(subject.id, -1)"></i>
          </div>
          <div class="card-body body-line-left d-flex">
            <div class="d-flex align-items-center my-auto">
              <h4 class="card-title px-1 fw-bold">{{ subject.name }}</h4>
              <i class="bi bi-check2-square text-success mx-1" style="font-size: 20px" v-if="isCertified(subject.id)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "SubjectCard",
  props: {
    roleId: {
      type: String,
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      subjects: [],
      role_subjects: [],
      votes: {},
      isLogged: false,
    };
  },

  mounted() {
    this.fetchSubjects();
    this.fetchRoleSubjects();
    this.fetchVotes();
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      this.isLogged = !!user;
    });
  },

  methods: {
    async fetchSubjects() {
      try {
        const response = await axios.get('/api/subjects');
        this.subjects = response.data;
        console.log('Subjects fetched:', this.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },

    async fetchRoleSubjects() {
      try {
        const response = await axios.get(`/api/roles_subjects/${this.roleId}`);
        this.role_subjects = response.data;
        console.log('Role subjects fetched:', this.role_subjects);
      } catch (error) {
        console.error('Error fetching role subjects:', error);
      }
    },

    async fetchVotes() {
      try {
        const promises = this.subjects.map(subject =>
            axios.get(`/api/votes/${this.roleId}/${subject.id}`)
                .then(response => {
                  this.$set(this.votes, subject.id, response.data.votes);
                })
        );
        await Promise.all(promises);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    },

    async vote(subjectId, voteChange) {
      if (!this.isLogged) return;

      try {
        await axios.post('/api/vote', {
          role_id: this.roleId,
          subject_id: subjectId,
          vote_change: voteChange
        });

        this.$data.votes[subjectId] = (this.$data.votes[subjectId] || 0) + voteChange;
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    },

    getVoteCount(subjectId) {
      return this.votes[subjectId] || 0;
    },

    isCertified(subjectId) {
      const certified = this.role_subjects.some(roleSubject => roleSubject.subject_id === subjectId);
      return certified;
    }
  },

  computed: {
    filteredSubjects() {
      if (!this.searchQuery) return this.subjects;

      const query = this.searchQuery.toLowerCase();
      return this.subjects.filter(subject =>
          subject.name.toLowerCase().includes(query)
      );
    }
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>