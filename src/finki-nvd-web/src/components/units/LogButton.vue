<template>
  <div v-if="isLogged">
    <div class="d-flex">
      <i class="bi bi-person btn btn-primary btn-sm mx-1" style="font-size: 20px; max-width: 10vw;">
        <span :style="{ fontSize: calculateFontSize(username) }" style="min-height: 2.5em">{{ username }}</span>
      </i>
      <button class="btn btn-primary btn-sm" @click="handleSignOut" >
        <i class="bi bi-box-arrow-right" style="font-size: 20px"></i>
      </button>
    </div>
  </div>
  <div class="d-flex">
    <button class="d-flex btn btn-primary btn-sm" @click="handleLogin" v-if="!isLogged">
      <span class="my-auto px-1" style="font-size: 16px">Log in</span>
      <i class="bi bi-box-arrow-in-right px-1" style="font-size: 20px"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "LogButton",
  methods: {
    calculateFontSize(username) {
      const minFontSize = 12;
      const maxFontSize = 24;
      const length = username.length;
      const fontSize = Math.max(minFontSize, Math.min(maxFontSize, maxFontSize - length));

      return `${fontSize}px`;
    }
  }
}
</script>

<script setup>

import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { useRouter } from "vue-router";
import { onMounted, ref} from "vue";

const isLogged = ref(false);
const router = useRouter();

const username = ref("");

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLogged.value = true;
      username.value = user.email.split("@")[0];
    }
    else {
      isLogged.value = false;
      username.value = '';
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/home")
  });
};

const handleLogin = () => {
    router.push("/login");
};
</script>

<style scoped>

</style>