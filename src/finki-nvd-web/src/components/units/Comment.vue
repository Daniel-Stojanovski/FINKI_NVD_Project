<template>
  <div>
    <div v-for="comment in topLevelComments" :key="comment.id" class="mb-1" style="max-width: 70vw"
         @mouseover="showReplyButton(comment.id)" @mouseleave="hideReplyButton(comment.id)">
      <div class="d-flex">
        <i v-if="comment.type === null" class="bi bi-arrow-right-circle" style="font-size: 26px;"></i>
        <i v-if="comment.type === 'R'" class="bi bi-arrow-right-circle" style="font-size: 26px;"></i>
        <i v-if="comment.type === 'Q'" class="bi bi-question-circle" style="font-size: 26px;"></i>
        <i v-if="comment.type === 'I'" class="bi bi-exclamation-circle" style="font-size: 26px;"></i>
        <button v-if="!replyingToCommentId || replyingToCommentId !== comment.id" v-show="showReply[comment.id]" class="px-2 mx-1 btn btn-outline-primary border-2 fw-bold btn-sm" style="scale: 0.75" @click="selectComment(comment.id, comment.comment_user, comment.depth)">
          Reply
        </button>
        <button v-if="replyingToCommentId === comment.id" class="px-2 mx-1 btn btn-primary btn-sm" style="scale: 0.75" @click="endReply">
          <i class="bi bi-x-circle m-auto"></i>
          Replying
        </button>
        <h6 class="mx-1 my-auto link-primary">{{ comment.comment_user }}:</h6><br>
        <p class="mx-2 my-auto text-wrap">{{ comment.comment_text }}</p>
      </div>

      <div v-for="childComment in getChildComments(comment.id, comment.depth)" :key="childComment.id"
           :style="{ 'margin-left': ((childComment.depth - 1) * 2) + 'em' }" class="mb-1 body-line-left"
           @mouseover="showReplyButton(childComment.id)" @mouseleave="hideReplyButton(childComment.id)">
        <div class="d-flex">
          <span style="font-size: 26px;">
            <i v-if="childComment.type === null || childComment.type === 'R'" class="bi bi-arrow-right-circle"></i>
<!--            <i v-if="childComment.type === 'R'" class="bi bi-arrow-right-circle"></i>-->
            <i v-if="childComment.type === 'Q'" class="bi bi-question-circle"></i>
            <i v-if="childComment.type === 'I'" class="bi bi-exclamation-circle"></i>
          </span>
          <button v-if="!replyingToCommentId || replyingToCommentId !== childComment.id" v-show="showReply[childComment.id]" class="px-2 mx-1 btn btn-outline-primary border-2 fw-bold btn-sm" style="scale: 0.75; max-height: 2.3rem" @click="selectComment(childComment.id, childComment.comment_user, childComment.depth)">
            Reply
          </button>
          <button v-if="replyingToCommentId === childComment.id" class="px-2 mx-1 btn btn-primary btn-sm" style="scale: 0.75" @click="endReply">
            <i class="bi bi-x-circle m-auto"></i>
            Replying
          </button>
          <h6 class="mx-1 my-2 link-primary">{{ childComment.comment_user }}:</h6><br>
          <p class="mx-2 my-2 text-wrap" style="max-width: 80%;">{{ childComment.comment_text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: "Comment",
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showReply: {},
      replyingToCommentId: null,
      replyingToUser: ''
    }
  },
  mounted() {
    console.log('Component Comment mounted');
  },
  methods: {
    getChildComments(parentId, depth) {
      const childComments = this.comments.filter(comment => comment.parent_id === parentId);
      return childComments.map(comment => {
        comment.depth = depth;
        const nestedComments = this.getChildComments(comment.id, depth + 1);
        return nestedComments.length ? [comment, ...nestedComments] : comment;
      }).flat();
    },

    selectComment(commentId, commentUser, depth) {
      this.replyingToCommentId = commentId;
      this.replyingToUser = commentUser;
      this.$emit('reply-selected', { commentId, depth, commentUser });
    },

    endReply() {
      this.replyingToCommentId = null;
      this.selectComment(null,null,0);
      this.replyingToUser = '';
    }
  },
  computed: {
    topLevelComments() {
      return this.comments.filter(comment => !comment.parent_id);
    }
  },
  setup() {
    const showReply = reactive({});

    const showReplyButton = commentId => {
      showReply[commentId] = true;
    };

    const hideReplyButton = commentId => {
      showReply[commentId] = false;
    };

    return {
      showReply,
      showReplyButton,
      hideReplyButton,
    };
  }
};
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>
