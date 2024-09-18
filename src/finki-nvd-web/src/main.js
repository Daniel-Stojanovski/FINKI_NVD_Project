import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

import { createRouter, createWebHistory } from 'vue-router';

import DiscussionBoard from './components/views/DiscussionBoard.vue';
import Home from './components/views/Home.vue';
import Guider from './components/views/Guider.vue';
import JobBoard from './components/views/JobBoard.vue';
import JobForm from "@/components/views/JobForm.vue";
import Register from "@/components/views/Register.vue";
import Login from "@/components/views/Login.vue";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEoa-tXP7LV42FQHe6TF1EtjQa5M_vZmg",
    authDomain: "finkiwebapp.firebaseapp.com",
    projectId: "finkiwebapp",
    storageBucket: "finkiwebapp.appspot.com",
    messagingSenderId: "712217787903",
    appId: "1:712217787903:web:4c8ad0aeedf32bcc277bca"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App);

app.config.globalProperties.$axios = axios;

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/board/:id', name: 'discussion-board', component: DiscussionBoard, props: true},
    { path: '/guider', component: Guider },
    { path: '/guide/:id', name: 'job-board', component: JobBoard, props: true},
    { path: '/add', name: 'job-form', component: JobForm, props: true},
    { path: '/register', name: 'register', component: Register},
    { path: '/login', name: 'login', component: Login},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

app.use(router);

app.mount('#app');
