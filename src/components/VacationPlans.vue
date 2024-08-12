<template>
    <v-app>
      <v-app-bar class="border-b">
        <v-app-bar-title>Buzzvel</v-app-bar-title>
      </v-app-bar>
  
      <v-main>
        <v-container>
          <h3>Ferias Planejadas</h3>

           <v-text-field
          label="Pesquisar plano de férias por ID"
          v-model="searchQuery"
          @input="searchVacationPlan"
        ></v-text-field>
  
          <v-card flat class="border md-4">
            <div class="d-flex justify-space-between">
              <v-card-title>Lista de Férias</v-card-title>
              <v-card-title>
                <v-dialog v-model="isDialogOpen" max-width="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" variant="tonal" @click="insertVacationPlan()" size="small">Adicionar</v-btn>
                  </template>
                    
                  <v-card>
                    <v-card-title>{{ isEditing ? 'Editar' : 'Adicionar' }} Plano de Férias</v-card-title>
                    <v-card-text>
                      <v-form ref="form">
                        <v-row>
                          <v-col>
                            <v-text-field label="Nome" variant="outlined" v-model="formData.title" :rules="inputRules"></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field label="Data" type='date' variant="outlined" v-model="formData.date" :rules="inputRules"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field label="Descrição" variant="outlined" v-model="formData.description" :rules="inputRules"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field label="Local" variant="outlined" v-model="formData.location" :rules="inputRules"></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field label="Participantes" variant="outlined" v-model="formData.participants"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-card-text>
  
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text="Cancelar" @click="isDialogOpen = false" variant="tonal"></v-btn>
                      <v-btn text="Salvar" @click="saveVacationPlan" variant="tonal" color="success"></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-title>
            </div>

             <!-- Indicador de carregamento -->
            <v-container v-if="isLoading" fill-height class="d-flex align-center justify-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-container>
  
            <v-table height="300px" fixed-header density="compact">
              <thead>
                <tr>
                  <th class="text-center">Título</th>
                  <th class="text-center">Descrição</th>
                  <th class="text-center">Data</th>
                  <th class="text-center">Local</th>
                  <th class="text-center">Participantes</th>
                  <th class="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plan in filteredVacationPlans" :key="plan.id">
                  <td class="text-center">{{ plan.title }}</td>
                  <td class="text-center">{{ plan.description }}</td>
                  <td class="text-center">{{ formatDate(plan.date) }}</td>
                  <td class="text-center">{{ plan.location }}</td>
                  <td v-if="plan.participants" class="text-center">{{ plan.participants }}</td>
                  <td>
                  <v-btn class='ma-1' title='Editar Férias' variant="tonal" color="primary" density="compact" @click="editVacationPlan(plan)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn class='ma-1'  title='Excluir Férias' variant="tonal" color="danger" density="compact" @click="deleteVacationPlan(plan.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <ButtonPdf :planId="plan.id" />
                </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- Snackbar for success message -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
          {{ snackbar.message }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.show = false">Fechar</v-btn>
          </template>
        </v-snackbar>

        </v-container>
      </v-main>
    </v-app>
  </template>


  
  <script>
  import api from '../api';
  import ButtonPdf from './ButtonPdf.vue';
  
  export default {
    components: {
      ButtonPdf,
    },
    data() {
    return {
      vacationPlans: [],
      isDialogOpen: false,
      isEditing: false,
      isLoading: false,
      searchQuery: '',
      filteredVacationPlans: [],
      formData: {
        id: null,
        title: '',
        description: '',
        date: '',
        location: '',
        participants: ''
      },
      inputRules: [
        value => value ? true : "Campo Obrigatório"
      ],
      snackbar: {
        show: false,
        message: '',
        color: 'success',
        timeout: 1000
      }
    };
  },
    mounted() {
        this.fetchVacationPlans();
    },


    methods: {  

      //Carregar dados
      async fetchVacationPlans() {
      this.isLoading = true; // Inicia o indicador de carregamento
      try {
        const response = await api.get('/vacation-plans');
        this.vacationPlans = response.data;
        this.filteredVacationPlans = this.vacationPlans;
        
      } catch (error) {
        console.error('Error fetching vacation plans:', error);
      } finally {
        this.isLoading = false; // Remove o indicador de carregamento
      }
    },




      //Pesquisar pelo ID  
      async searchVacationPlan() {     
        if (this.searchQuery) {          
          this.filteredVacationPlans = this.vacationPlans.filter(plan => plan.id.toString().includes(this.searchQuery));
        } else {   
          this.filteredVacationPlans = this.vacationPlans;
        }
      },



      // Salvar os dados
      async saveVacationPlan() {
        if (!this.$refs.form.validate()) return;
        try {
          this.isLoading = true;
          if (this.isEditing) {
            await api.put(`/vacation-plans/${this.formData.id}`, this.formData);
          } else {
            await api.post('/vacation-plans/create', this.formData);
          }
          this.showSnackbar('Salvo com sucesso', 'success');
          this.isDialogOpen = false;
          this.fetchVacationPlans();          
          this.resetFormData();
          
        } catch (error) {
          console.error('Error saving vacation plan:', error);
          this.showSnackbar('Erro ao salvar o plano de férias', 'error');
        } finally {
          this.isLoading = false;
        }
      },

      // Excluir os dados
      async deleteVacationPlan(id) {
        try {
          await api.delete(`/vacation-plans/${id}`);
          this.vacationPlans = this.vacationPlans.filter(plan => plan.id !== id);
          this.filteredVacationPlans = this.vacationPlans;
          this.showSnackbar('Excluído com sucesso', 'success');
        } catch (error) {
          console.error('Error deleting vacation plan:', error);
          this.showSnackbar('Erro ao excluir o plano de férias', 'error');
        }
      },
    
      insertVacationPlan() {      
        this.isDialogOpen = true;
        this.isEditing = false;
        this.formData= {
          id: null,
          title: '',
          description: '',
          date: '',
          location: '',
          participants: ''
        };
      },

      editVacationPlan(plan) {
        this.isEditing = true;
        const formattedDate = this.formatDateForInput(plan.date);
        this.formData = {
          ...plan,
          date: formattedDate,
        };
        this.isDialogOpen = true;
      },

      showSnackbar(message, color) {
        this.snackbar.message = message;
        this.snackbar.color = color;
        this.snackbar.show = true;
      },
    
    
      resetFormData() {
          this.formData = {
              id: null,
              title: '',
              description: '',
              date: '',
              location: '',
              participants: ''
          };
          this.isEditing = false;
      },
      
      formatDate(dateString) {
          const date = new Date(dateString);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          return date.toLocaleDateString(undefined, options);
      },

      formatDateForInput(dateString) {    
        if (dateString.includes('T') || dateString.includes('-')) {
          return dateString.split('T')[0];
        }
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
      },
    }
  };
  </script>
  
  <style scoped>
  .headline {
    font-weight: bold;
  }
  .mb-2 {
    margin-bottom: 16px;
  }
  </style>