<template>
  <div class="icon-container d-flex align-items-center">
    <div class="icon-wrapper">
      <img v-for="(icon, index) in icons" :key="index" src="https://www.finki.ukim.mk/Content/dataImages/downloads/logo-large-500x500_2.png" class="icon-img" />
    </div>
    <div class="icon-wrapper2">
      <img v-for="(icon, index) in icons" :key="index" src="https://www.finki.ukim.mk/Content/dataImages/downloads/logo-large-500x500_2.png" class="icon-img" />
    </div>


    <div class="card rounded-4 m-auto" style="width: 24rem;">
      <div class="card-header">
        <h1 class="card-title text-center">REGISTER</h1>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <input class="border-bottom border-2 my-2" style="width: 100%" type="text" placeholder="Email" v-model="email">
          <input class="border-bottom border-2 my-2" style="width: 100%"  type="password" placeholder="Password" v-model="password"></li>
        <li class="list-group-item mx-auto text-danger text-center my-0" v-if="errorMsg">
          <i class="bi bi-exclamation-diamond"></i>
          <p>{{ errorMsg }}</p>
        </li>
      </ul>
      <div class="card-body mx-auto">
        <button class="btn btn-primary mx-3" @click="register">Submit</button>
        <button class="btn btn-secondary mx-3" @click="redirectLogin">Log in</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register"
}
</script>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();
const errorMsg = ref("");
const icons = ref(new Array(30).fill(null));

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        console.log("Successfully registered!");
        router.push('/home')
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            errorMsg.value = "Invalid email";
            break;
          case "auth/invalid-password":
            errorMsg.value = "Invalid password";
            break;
          default:
            errorMsg.value = "Invalid email or password";
            break;
        }
      })
}

const redirectLogin = () => {
  router.push("/login");
};
</script>

<style>
.icon-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.icon-wrapper {
  display: flex;
  position: absolute;
  top: 35%;
  left: -10%;
  width: 120%;
  rotate: -25deg;
  animation: moveIcons 20s linear infinite;
  z-index: -1;
}

.icon-wrapper2 {
  display: flex;
  position: absolute;

  top: 35%;
  left: -10%;
  width: 120%;
  rotate: 25deg;
  animation: moveIcons 20s linear reverse infinite;
  z-index: -2;
}

.icon-img {
  width: 10em;
  height: 10em;
}


@keyframes moveIcons {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

</style>