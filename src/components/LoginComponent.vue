<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="pa-6" elevation="8">
              <v-card-title class="justify-center headline">
                Login
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="emailRules"
                    required
                    outlined
                    prepend-inner-icon="mdi-email"
                  ></v-text-field>

                  <v-text-field
                    label="Password"
                    v-model="password"
                    :rules="passwordRules"
                    type="password"
                    required
                    outlined
                    prepend-inner-icon="mdi-lock"
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions class="d-flex flex-column">
                <v-btn
                  color="primary"
                  class="ma-2"
                  @click="login"
                  :disabled="!valid"
                  large
                >
                  Entrar
                </v-btn>                
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
    try {
        const response = await api.post('/login', {
            email: this.email,
            password: this.password
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/vacation-plans');
    } catch (error) {
        console.error('Login error:', error.response.data);
        alert('Login ou senha inválidos');
    }
}
  }
};
</script>