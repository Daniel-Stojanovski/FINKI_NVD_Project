<template>
  <div id="sidebar" class="col-md-2 bg-white border-end border-3">
    <br>
    <div style="text-align: center">
      <router-link :to="'/home'">
        <img src="https://www.finki.ukim.mk/Content/dataImages/downloads/logo-large-500x500_2.png" width="40%" height="40%" alt="IO">
      </router-link>
    </div>
    <hr/>
    <div v-show="!isLogged">
      <h5 class="p-2 my-0"> Popular </h5>
      <ul class="flex-column p-2 m-0 my-0">
        <li v-for="subject in subjects" :key="subject.id" class="nav-item p-0 m-0 my-1 link-gray">
          <router-link :to="'/board/'+subject.id"
                       class="nav-link d-flex justify-content-between align-items-center"
                       :class="{ 'link-primary': isBoardActive(subject.id) }">
            {{ subject.name }}
            <i class="bi bi-star-fill"></i>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-show="isLogged">
      <h5 class="p-2 my-0"> Following </h5>
      <ul class="flex-column p-2 m-0 my-0">
        <li v-for="favorite in favorites" :key="favorite.id"
            class="nav-item p-0 m-0 my-1 link-gray">
          <router-link :to="'/board/'+favorite.id"
                       class="nav-link d-flex justify-content-between align-items-center"
                       :class="{ 'link-primary': isBoardActive(favorite.id) }"
                       style="font-size: 14px;">
            {{ favorite.name }}
            <i class="bi bi-star-fill"></i>
          </router-link>
        </li>
      </ul>
<!--      <hr/>
      <h5 class="p-2 my-0"> Tags & Keys</h5>
      <ul class="nav p-1 m-0 my-0">
        <li v-for="tag in tags" :key="tag" class="nav-item p-0">
          <button class="px-2 btn btn-outline-primary btn-outline-bold rounded-3 btn-sm">
            {{ tag }}
          </button>
        </li>
      </ul>-->
    </div>
  </div>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default {
  name: "Sidebar",
  props: {},
  data() {
    return {
      tags: [],
      subjects: [],
      favorites: [],
      isLogged: false,
    };
  },
  mounted() {
    console.log('Component Sidebar mounted');
    // this.fetchTags();
    this.fetchFavorites();
    this.fetchPopular();
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      this.isLogged = !!user;
    });
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        this.fetchFavorites();
      }
    }
  },
  methods: {
    async fetchTags() {
      try {
        const response = await this.$axios.get('/api/tags');
        // console.log(response);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    },

    async fetchPopular() {
      try {
        const response = await this.$axios.get('/api/subjects');
        let subjects = response.data;

        let subjectsWithComments = [];

        await Promise.all(subjects.map(async subject => {
          try {
            const commentsResponse = await this.$axios.get(`/api/comments/${subject.id}`);
            const commentsCount = commentsResponse.data.length;
            subjectsWithComments.push({
              ...subject,
              comments_count: commentsCount
            });
          } catch (commentsError) {
            console.error(`Error fetching comments for subject ${subject.id}:`, commentsError);
          }
        }));

        subjectsWithComments.sort((a, b) => b.comments_count - a.comments_count);

        this.subjects = subjectsWithComments.slice(0, 10);
      } catch (error) {
        console.error('Error fetching popular subjects:', error);
      }
    },

    async fetchFavorites() {
      try {
        const response = await this.$axios.get('/api/favorites');
        this.favorites = response.data;
        // console.log(response);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    },

    isBoardActive(boardId) {
      return this.$route.params.id === boardId.toString();
    },
  },
};
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

#sidebar {
  min-height: 100vh;
}

</style>