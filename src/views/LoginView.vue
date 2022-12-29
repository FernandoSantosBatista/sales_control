<template>
  <div class="container">
  <div class="col-md-6 offset-md-3">
    
    <form class="card shadow p-3 mb-5 bg-body rounded" @submit.prevent="handleSubmit">
      <h1 >Login</h1>
      <input class="form-control shadow-sm mb-4 bg-body rounded"
           type="email" placeholder="email" v-model.trim="email" />
      <input class="form-control shadow-sm mb-4 bg-body rounded"
          
        type="password"
        placeholder="senha"
        v-model.trim="password"
      />
      <button class="btn btn-secondary" type="submit" :disabled="userStore.loadingUser">Enviar</button>
    </form>
  </div>
</div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const email = ref("");
const password = ref("");

const handleSubmit = async () => {
  if (!email.value || password.value.length < 6) {
    return alert("Preencher todos os campos");
  }
  await userStore.loginUser(email.value, password.value);
};
</script>
