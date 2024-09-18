<template>
  <div class="d-flex mx-4 input-group-text p-0 mt-2 px-3 p-1 btn-outline-gray border-2 rounded-5 bg-white input-container"
       style="color: #bebebe" v-if="isLogged">
    <i class="bi bi-arrow-right-circle" :class="{ 'text-primary': selectedIcon === 'discuss' }" @click="selectIcon('discuss')" style="font-size: 20px;"></i>
    <i class="bi bi-question-circle mx-1" :class="{ 'text-primary': selectedIcon === 'ask' }" @click="selectIcon('ask')" style="font-size: 20px;"></i>
    <i class="bi bi-exclamation-circle" :class="{ 'text-primary': selectedIcon === 'emphasize' }" @click="selectIcon('emphasize')" style="font-size: 20px;"></i>

    <input class="mx-1" style="width: 100%;" type="text" v-model="commentText"
           @keydown.enter="postComment(selectedCommentId, selectedCommentDepth)"
           :placeholder="placeholderText" aria-label="Comment">
    <i class="bi bi-arrow-up-circle" @click="postComment(selectedCommentId, selectedCommentDepth)" style="font-size: 20px;"></i>
  </div>
  <div class="d-flex" v-if="!isLogged">
    <router-link class="m-auto" to="/login">Log in to engage in the discussion!</router-link>
  </div>
</template>

<script>
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "InputField",
  props: {
    id: {
      type: String,
      required: true
    },
    selectedCommentId: {
      type: Number,
      default: null
    },
    selectedCommentDepth: {
      type: Number,
      default: 0
    },
    replyingToUser: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      commentUser: '',
      commentText: '',
      selectedIcon: 'discuss',
      isLogged: false,
      replyingToUser: null
    };
  },
  mounted() {
    console.log('Component InputField mounted');

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.commentUser = user.email.split("@")[0];
        console.log(this.commentUser, "is logged in");
        this.isLogged = true;
      } else {
        this.commentUser = '';
        this.isLogged = false;
      }
    });
  },
  methods: {
    postComment(parentId, depth) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.commentUser = user.email.split("@")[0];
          this.isLogged = true;
        } else {
          this.commentUser = '';
          this.isLogged = false;
        }
      });

      if (this.commentText.length > 0) {
        let type = null;
        switch (this.selectedIcon) {
          case 'ask':
            type = 'Q';
            break;
          case 'emphasize':
            type = 'I';
            break;
        }

        axios.post('/api/comments', {
          board_id: this.id,
          commentText: this.commentText,
          parent_id: parentId,
          type: type,
          depth: depth + 1,
          commentUser: this.commentUser,
        }).then(() => {
          this.$emit('comment-posted');
          this.commentText = '';
          this.replyingToUser = null;
        }).catch(error => {
          console.error('Error posting comment:', error);
        });
      }
    },

    selectIcon(icon) {
      this.selectedIcon = icon;
    },

    clearReply() {
      this.replyingToUser = null;
      this.selectedCommentId = null;
      this.selectedCommentDepth = 0;
    }
  },
  computed: {
    placeholderText() {
      switch (this.selectedIcon) {
        case 'ask':
          return 'Ask';
        case 'emphasize':
          return 'Emphasize';
        default:
          return 'Discuss';
      }
    },
  },
}
</script>

<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {onMounted, ref} from "vue";

const isLogged = ref(false);
let auth;

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLogged.value = true;
    }
    else {
      isLogged.value = false;
    }
  });
});
</script>

<style scoped>
.text-primary {
  color: blue !important;
}

.input-container:has(> input:focus ),
.input-container:has(> input:hover ),
.input-container:has(> i:hover ) {
  border-color: #0D6EFD;
  color: #0D6EFD;
}
</style>

