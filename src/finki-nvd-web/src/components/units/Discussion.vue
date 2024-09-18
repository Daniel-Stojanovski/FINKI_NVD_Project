<template>
  <div id="discussion" class="container user-select-none">
    <div class="row">
      <div v-for="subject in filteredSubjects" :key="subject.id"
           class="col-md-10 mb-3">
        <div class="card border-0 border-bottom rounded-0">
          <div class="card-body mx-3">
            <div class="d-flex align-items-center">
              <button @click="toggleFavorite(subject)"
                      :class="{ 'border-3': !subject.isFavorite, 'btn-primary': subject.isFavorite }"
                      class="btn border d-flex justify-content-center pt-0"
                      style="width: 40px; height:40px">
                <i :class="{ 'bi-star': !subject.isFavorite, 'text-gray': !subject.isFavorite, }"
                   class="bi bi-star-fill m-auto"
                   style="font-size: 22px;">
                </i>
              </button>
              <h3 class="p-3 card-title fw-bold">
                {{ subject.name }}
              </h3>
            </div>
            <div class="card-text body-line-left d-flex pb-1">
              <i class="bi bi-info-circle"
                 style="font-size: 26px;">
              </i>
              <p class="mx-3 my-auto text-wrap"
                 style="width: 100%; font-size: 14px;">
                {{ subject.info }}
              </p>
            </div>
            <div class="d-flex mx-1">
              <span class="px-2 mx-2 my-auto">
                <i class="bi bi-chat-right"></i>
                {{ subject.comments_count }}
              </span>
              <router-link :to="'/board/'+subject.id">
                <button class="px-3 mx-2 my-auto btn btn-primary btn-sm">
                  <span v-show="isLogged">Join Discussion</span>
                  <span v-show="!isLogged">View Discussion</span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "Discussion",
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      subjects: [],
      isLogged: false,
    };
  },
  mounted() {
    console.log('Component Discussion mounted');
    this.fetchSubjects();
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      this.isLogged = !!user;
    });
  },
  methods: {
    async fetchSubjects() {
      try {
        const response = await this.$axios.get('/api/subjects');
        this.subjects = response.data.map(subject => ({
          ...subject,
          isFavorite: localStorage.getItem(`favorite_${subject.id}`) === 'true',
          comments_count: 0,
        }));

        await Promise.all(this.subjects.map(async subject => {
          const commentsResponse = await this.$axios.get(`/api/comments/${subject.id}`);
          subject.comments_count = commentsResponse.data.length;
        }));

        this.subjects.sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return 0;
        });
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },

    async toggleFavorite(subject) {
      try {
        if (subject.isFavorite) {
          await this.$axios.delete(`/api/favorites/${subject.id}`);
          localStorage.setItem(`favorite_${subject.id}`, 'false');
        } else {
          await this.$axios.post('/api/favorites', {
            id: subject.id,
            name: subject.name
          });
          localStorage.setItem(`favorite_${subject.id}`, 'true');
        }
        subject.isFavorite = !subject.isFavorite;
      } catch (error) {
        console.error('Error toggling favorite status:', error);
      }
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

.text-gray {
  color: #bebebe;
}
</style>

