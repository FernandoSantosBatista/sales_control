<template>
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
          <th></th>
          <th>Editar</th>
          <th>Excluir</th>
        </tr>
      </thead>
      <tbody v-for="(message, index) in getCurrentPageMonths()" :key="index">
    
        <tr>
          <td>{{ message.text }}</td>
          <td>{{ message.price }}</td>
          <td>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="currentMessage = message">
  Editar
</button>
         </td>
         <td><button type="button" class="btn btn-danger" @click="deleteMessage(message.id)">Excluir</button></td>
         
        </tr>
      </tbody>
    </table>

  <!-- Modal -->
  <div class="modal fade" ref="editModal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Atualizar</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input class="form-control shadow-sm mb-2 bg-body rounded" type="text" v-model="currentMessage.text">
          <input class="form-control shadow-sm mb-2 bg-body rounded" type="number" v-model="currentMessage.price">
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          <button type="button" class="btn btn-primary" @click="updateMessage(currentMessage)">Atualizar</button>
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
  name: "ManagementView",
  components: {},
  data: () => {
    return {
     messages: ref([]),
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: "",
      currentMessage: {},
    
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
    
    getCurrentPageMonths() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filterMonths().slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
    },
 



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
    const latestQuery = query(collection(db, "messages"), orderBy('date', "desc"));
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
