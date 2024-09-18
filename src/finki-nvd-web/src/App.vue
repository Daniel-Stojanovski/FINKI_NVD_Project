<template>
  <router-view></router-view>
</template>

<script>
import Sidebar from '@/components/sections/Sidebar.vue';
import Comment from "@/components/units/Comment.vue";
import Discussion from "@/components/units/Discussion.vue";
import Home from "@/components/views/Home.vue";
import Guider from "@/components/views/Guider.vue";
import DiscussionBoard from "@/components/views/DiscussionBoard.vue";

export default {
  components: {
    Discussion,
    Comment,
    Sidebar,
  },
  data() {
    return {
      actors: [],
      subjects: [],
      comments: [],
      newComment: '',
    };
  },
  mounted() {
    console.log('Component mounted');
  },
  methods: {
  },
};
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

.sidebar {
  min-height: 100vh;
}

.list {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
  overflow: auto;
  height: 60%;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px;
  padding: 10px;
  /*border: 1px solid #ddd;*/
}

.card {
  border: none;
}
.body-line-left {
  border-left: #bebebe 3px solid;
  padding-left: 1rem;
}

.btn:hover {
  color: #bebebe !important;
  border-color: #bebebe;
}
.btn-strong {
  font-weight: 600;
}
.btn-rounded {
  border-radius: 100px;
}
.btn-gray {
  color: #fff;
  border-color: #bebebe;
  background-color: #bebebe;
}
.btn-outline-bold {
  border-width: 2px;
}
.btn-outline-bolder {
  border-width: 3px;
}
.btn-outline-gray {
  color: #bebebe;
  border-color: #bebebe;
}

.link-gray {
  color: #bebebe;
}

input {
  border: none;
  outline: none;
  box-shadow: none;
}
</style>
