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
    <table class="table table-striped table-hover text-start">
      <thead class="table-dark">
        <tr>
          <th scope="col">
            <input
              class="form-control"
              v-model="searchTerm"
              placeholder="Pesquisar..."
            />
          </th>
          <th scope="col"></th>
          <th>Editar</th>
        </tr>
      </thead>
      <tbody v-for="(message, index) in getCurrentPageMonths()" :key="index">
    
        <tr>
          <td>{{ message.text }}</td>
          <td>{{ message.price }}</td>
         
          <td>
            <router-link
              type="button"
              class="btn btn-primary"
              :to="`/gerenciamento/`"
            >
              Editar
            </router-link>
            <!-- button to open edit modal -->
          </td>
        </tr>
      </tbody>
    </table>

    <button
      type="button"
      class="btn btn-secondary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Total por mês
    </button>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Total</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <ul
                class="list-group"
                v-for="(value, key) in salesByMonth"
                :key="key"
              >
                <li class="list-group-item">
                  {{ key }} <br />{{ value.toFixed(2) }}
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <nav aria-label="Navegação de página exemplo">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a @click="currentPage--" class="page-link" href="#">Anterior</a>
        </li>

        <li class="page-item">
          <a class="page-link" href="#" @click="currentPage++">Próximo</a>
        </li>
      </ul>
    </nav>
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
