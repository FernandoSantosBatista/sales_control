<template>
  <div id="app">
    <input v-model="searchTerm" placeholder="Pesquisar..." />
    <div v-for="(message, index) in getCurrentPageMonths()" :key="index">
      <input v-model="message.text" type="text" />
      <input v-model="message.price" type="number" />
      {{ message.date.toLocaleDateString() }}

      <button @click="updateMessage(message)">update</button>
      <button @click="deleteMessage(message.id)">delete</button>
    </div>
    <hr />
    <div class="container col-5">
      <div class="row">
        <div
          v-for="(value, key) in salesByMonth"
          :key="key"
          class="col order-last"
        >
          {{ key }} <br />{{ value.toFixed(2) }}
        </div>
      </div>
    </div>

    <input ref="textmessage" placeholder="mês ..." type="text" />
    <input ref="pricemessage" placeholder="preço ..." type="value" />
    <button @click="addNewMessage">addnew</button>
  </div>

  <hr />
  <div>
    <button @click="currentPage--">Anterior</button>
    <button @click="currentPage++">Próximo</button>
  </div>
</template>

<script>
import {
  onSnapshot,
  collection,
  doc,
  deleteDoc,
  setDoc,
  addDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ref, onUnmounted } from "vue";

export default {
  name: "HomeView",
  components: {},
  data: () => {
    return {
      messages: ref([]),
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: "",
    };
  },

  computed: {
    salesByMonth() {
      return this.messages.reduce((acc, curr) => {
        if (curr.text in acc) {
          acc[curr.text]  += curr.price;
        } else {
          acc[curr.text] = curr.price;
        }
        return acc;
      }, {});
    },
  },

  methods: {
    addNewMessage: function () {
      addDoc(collection(db, "messages"), {
        text: this.$refs.textmessage.value,
        price: parseFloat(this.$refs.pricemessage.value),
        date: Date.now(),
      });
    },
    filterMonths() {
      return this.messages.filter((message) =>
        message.text.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    getCurrentPageMonths() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filterMonths().slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
    },

    updateMessage: function (message) {
      setDoc(doc(db, "messages", message.id), {
        text: message.text,
        price: message.price,
        date: message.date,
      });
    },
    deleteMessage: function (id) {
      deleteDoc(doc(db, "messages", id));
    },
  },

  mounted() {
    const latestQuery = query(collection(db, "messages"), orderBy('date'));
    const livemessages = onSnapshot(latestQuery, (snapshot) => {
      this.messages = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          text: doc.data().text,
          price: doc.data().price,
          date: new Date(doc.data().date)
        }
      });
    });
    onUnmounted(livemessages);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
