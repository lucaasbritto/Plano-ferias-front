<template>    
    <v-btn title='Fazer download' variant="tonal" color="success" density="compact" @click="downloadPdf">
        <v-icon>mdi-download</v-icon>
    </v-btn>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    props: {
      planId: {
        type: Number,
        required: true,
      },
    },
    methods: {
      async downloadPdf() {
        try {
          const response = await api.get(`/vacation-plans/${this.planId}/pdf`, {
            responseType: 'blob',
          });
  
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `vacation_plan_${this.planId}.pdf`);
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          console.error('Error downloading PDF:', error);
        }
      },
    },
  };
  </script>