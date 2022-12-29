<template>
  <div class="container">
    <form action="" method="POST" name="formulario">
      <div class="form-group">
        <div class="col-md-6 offset-md-3">
          <select
            ref="textmessage"
            type="text"
            class="form-control shadow-sm mb-4 bg-body rounded"
          >
            <option>Janeiro</option>
            <option>Fevereiro</option>
            <option>Março</option>
            <option>Abril</option>
            <option>Maio</option>
            <option>Junho</option>
            <option>Julho</option>
            <option>Agosto</option>
            <option>Setembro</option>
            <option>Outubro</option>
            <option>Novembro</option>
            <option>Dezembro</option>

          </select>
        </div>
      </div>

      <div class="form-group">
        <div class="col-md-6 offset-md-3">
          <input
            ref="pricemessage"
            type="number"
            class="form-control shadow-sm mb-2 bg-body rounded"
          />
        </div>
      </div>
      <br />
      <div class="form-group">
        <div class="col-md-6 offset-md-3">
          <div class="d-grid gap-2">
            <button
              @click="addNewMessage"
              type="button"
              class="btn btn-secondary"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
  <br />

  <hr />
  <div class="container col-md-6 offset-md-3">
  <!-- ... -->
  <table class="table table-striped table-hover text-start">
    <thead class="table-dark">
      <tr>
        <th>
          <router-link
            type="button"
            class="btn btn-secondary"
            :to="`/gerenciamento/`"
          >
            Editar
          </router-link>
        </th>
        <th>Total</th>
        
      </tr>
    </thead>
    <tbody v-for="(value, key) in salesByMonth" :key="key">
      <tr>
        <td> {{ key }} </td>
        <td>{{ value.toFixed(2) }}</td>
      </tr>
    </tbody>
  </table>

 
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
      itemsPerPage: 5,
      searchTerm: "",
    };
  },

  computed: {
    salesByMonth() {
      return this.messages.reduce((acc, curr) => {
        if (curr.text in acc) {
          acc[curr.text] += curr.price;
        } else {
          acc[curr.text] = curr.price;
        }
        return acc;
      }, {});
    },
  },

  methods: {
    addNewMessage: function () {
  try {
    addDoc(collection(db, "messages"), {
      text: this.$refs.textmessage.value,
      price: parseFloat(this.$refs.pricemessage.value),
      date: Date.now(),
    });
    alert("Valor adicionada com sucesso!");
  } catch (e) {
    console.error(e);
    alert("Ocorreu um erro ao tentar adicionar a mensagem. Por favor, tente novamente.");
  }
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
    const latestQuery = query(collection(db, "messages"), orderBy("date", "desc"));
    const livemessages = onSnapshot(latestQuery, (snapshot) => {
      this.messages = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          text: doc.data().text,
          price: doc.data().price,
          date: doc.data().date,
        };
      });
    });
    onUnmounted(livemessages);
  },
};
</script>

<style></style>
