<template>
  <div class="container">
    <div class="col-md-6 offset-md-3">
      <input
        class="form-control"
        v-model="searchTerm"
        placeholder="Pesquisar..."
      />
    </div>
    <br />

    <form
      class="card shadow p-3 mb-5 bg-body rounded"
      method="POST"
      name="formulario"
      v-for="(message, index) in getCurrentPageMonths()"
      :key="index"
    >
      <div class="form-group">
        <div class="col-md-6 offset-md-3">
          <select
            v-model="message.text"
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
            v-model="message.price"
            type="number"
            class="form-control shadow-sm mb-2 bg-body rounded"
          />
        </div>
      </div>
      <br />

      <div class="d-grid gap-2 col-md-6 offset-md-3">
        <button
          @click="updateMessage(message)"
          type="button"
          class="btn btn-primary"
        >
          Atualizar
        </button>
        <button
          @click="deleteMessage(message.id)"
          type="button"
          class="btn btn-danger"
        >
          Deletar
        </button>
      </div>
    </form>

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
        alert("Mensagem adicionada com sucesso!");
      } catch (e) {
        console.error(e);
        alert(
          "Ocorreu um erro ao tentar adicionar a mensagem. Por favor, tente novamente."
        );
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
      try {
        setDoc(doc(db, "messages", message.id), {
          text: message.text,
          price: message.price,
          date: message.date,
        });
        alert("Atualizada com sucesso!");
      } catch (e) {
        console.error(e);
        alert(
          "Ocorreu um erro ao tentar atualizar a mensagem. Por favor, tente novamente."
        );
      }
    },

    deleteMessage: function (id) {
      if (
        confirm("Cuidado, essa ação não poderá ser desfeita. Deseja continuar?")
      ) {
        try {
          deleteDoc(doc(db, "messages", id));
        } catch (e) {
          console.error(e);
          alert(
            "Ocorreu um erro ao tentar deletar a mensagem. Por favor, tente novamente."
          );
        }
      }
    },
  },

  mounted() {
    const latestQuery = query(
      collection(db, "messages"),
      orderBy("date", "asc")
    );
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

<style>
.card {
  background-color: #f8f9fa;
}
</style>
