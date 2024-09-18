<template>
  <div id="subjectCard" class="container">
    <div class="row">
      <div v-for="subject in filteredSubjects" :key="subject.id" class="col-md-4 mb-2">
        <div class="d-flex py-3 px-2 rounded-4 border border-2">
          <div class="mx-4 m-auto justify-content-center align-items-center" style="font-size: 24px">
            <div>
              <i class="bi bi-check-square text-primary" v-if="selectedSubjects.includes(subject.id)"
                 style="font-size: 24px;" @click="toggleSubjectSelection(subject)"></i>
              <i class="bi bi-slash-square text-gray" v-else
                 style="font-size: 24px;" @click="toggleSubjectSelection(subject)"></i>
            </div>
          </div>
          <div class="card-body body-line-left d-flex">
            <div class="d-flex align-items-center my-auto">
              <h4 class="card-title px-1"><b>{{ subject.name }}</b></h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubjectCheck",
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      subjects: [],
      selectedSubjects: [],
      selectedSubjectNames: [],
      isLogged: false,
    };
  },

  mounted() {
    this.fetchSubjects();
  },

  methods: {
    async fetchSubjects() {
      try {
        const response = await this.$axios.get('/api/subjects');
        this.subjects = response.data;
        console.log('Subjects fetched:', this.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },

    toggleSubjectSelection(subject) {
      const subjectIndex = this.selectedSubjects.indexOf(subject.id);
      if (subjectIndex === -1) {
        this.selectedSubjects.push(subject.id);
        this.selectedSubjectNames.push(subject.name);
      } else {
        this.selectedSubjects.splice(subjectIndex, 1);
        const nameIndex = this.selectedSubjectNames.indexOf(subject.name);
        if (nameIndex !== -1) {
          this.selectedSubjectNames.splice(nameIndex, 1);
        }
      }

      this.$emit('update-selected-subjects', {
        selectedSubjects: this.selectedSubjects,
        selectedSubjectNames: this.selectedSubjectNames,
      });
    },
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

/*.flip-div {
  transform-style: preserve-3d;
  transition: all 1s linear;
}
.flip-div:active {
  transform: rotateY(180deg);
}
.flip-back {
  backface-visibility: hidden;
  transform: rotateY(180deg);
}
.flip-front {
  backface-visibility: hidden;
}*/

</style>
