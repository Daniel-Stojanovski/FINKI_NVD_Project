<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <Sidebar></Sidebar>
        <!-- Main Content -->
        <div class="col-md-10 main-content">
          <div class="mt-2 mx-3" id="main-box">
            <div class="card border-0">
              <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div class="d-flex align-items-center">
                    <button @click="toggleFavorite(findObject(this.subjects))"
                            :class="{ 'btn-outline-gray': !findObject(this.subjects).isFavorite, 'btn-primary': findObject(this.subjects).isFavorite }" class="btn btn-outline-bolder d-flex justify-content-center pt-0" style="width: 40px; height:40px">
                      <i class="bi bi-star-fill m-auto" style="font-size: 22px;"></i>
                    </button>
                    <div class="d-flex">
                      <h3 class="p-3 card-title"><b>{{ findObject(this.subjects, 'name') }}</b></h3>
                      <div class="py-4"><i class="bi bi-tags"></i> {{formTagFromKeys()}}{{ toThreeDigits(id) }}</div>
                    </div>
                  </div>
                </div>
                <router-link :to="'/home'" class="btn btn-outline-gray border-0">
                  <i class="bi bi-x-circle" style="font-size: 32px;"></i>
                </router-link>
              </div>
              <div class="card-text body-line-left d-flex pb-1" id="main-view">
                <Comment :comments="comments" @reply-selected="handleReplySelected"></Comment>
              </div>
            </div>
          </div>
          <InputField :id="id" :selectedCommentId="selectedCommentId" :selectedCommentDepth="selectedCommentDepth" @comment-posted="fetchBoardComments"></InputField>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import Discussion from "@/components/units/Discussion.vue";
import Comment from "@/components/units/Comment.vue";
import Sidebar from "@/components/sections/Sidebar.vue";
import NavBar from "@/components/sections/NavBar.vue";
import InputField from "@/components/units/InputField.vue";

export default {
  name: "DiscussionBoard",
  components: {
    InputField,
    NavBar,
    Discussion,
    Comment,
    Sidebar,
  },
  props: ['id'],
  data() {
    return {
      comments: [],
      selectedCommentId: null,
      selectedCommentDepth: 0,
      commentText: '',

      favorites: [],
      subjects: [],

      boardFollow: false,
    }
  },
  mounted() {
    console.log('Component DiscussionBoard mounted');
    this.fetchSubjects();
    this.fetchBoardComments();
    this.fetchFavorites();
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        this.fetchSubjects();
        this.fetchBoardComments();
        this.fetchFavorites();
      }
    }
  },
  methods: {
    formTagFromKeys(key1,key2,key3,key4,key5) {
      return ;
    },
    toThreeDigits(value) {
      return value.toString().padStart(3, '0');
    },

    async fetchSubjects() {
      try {
        const response = await this.$axios.get('/api/subjects');
        // console.log(response);
        this.subjects = response.data.map(subject => ({
          ...subject,
          isFavorite: localStorage.getItem(`favorite_${subject.id}`) === 'true',
        }));
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },

    async postFavorite(subject) {
      try {
        await this.$axios.post('/api/favorites', {
          id: subject.id,
          name: subject.name
        });

        console.log('Subject added to favorites');
        localStorage.setItem(`favorite_${subject.id}`, 'true');
      } catch (error) {
        console.error('Error adding subject to favorites:', error);
      }
    },

    async deleteFavorite(subject) {
      try {
        await this.$axios.delete(`/api/favorites/${subject.id}`);

        console.log('Subject removed from favorites');
        localStorage.setItem(`favorite_${subject.id}`, 'false');
        localStorage.removeItem(`favorite_${subject.id}`);
      } catch (error) {
        console.error('Error removing subject from favorites:', error);
      }
    },

    async toggleFavorite(subject) {
      try {
        if (subject.isFavorite) {
          await this.deleteFavorite(subject);
        } else {
          await this.postFavorite(subject);
        }
        subject.isFavorite = !subject.isFavorite; // Toggle favorite status
      } catch (error) {
        console.error('Error toggling favorite status:', error);
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

    async fetchBoardComments() {
      try {
        const response = await axios.get(`/api/comments/${this.id}`);
        this.comments = response.data;
      } catch (error) {
        console.error('Error fetching board comments:', error);
      }
    },

    async fetchFavorites() {
      try {
        const response = await axios.get('/api/favorites');
        this.favorites = response.data;
        // console.log(response);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    },

    handleReplySelected({ commentId, depth, commentUser }) {
      this.selectedCommentId = commentId;
      this.selectedCommentDepth = depth;
    },
  },
}
</script>

<style>

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

#main-view {
  height: 76vh;
  overflow-y: auto;
}

#main-box {
  height: 90vh;
  overflow-y: hidden;
}
</style>


