import Vue from 'vue';
import Vuex from 'vuex';

import axios from './axios-auth';
import globalAxios from 'axios';

import router from './router';

Vue.use(Vuex);

const API_KEY = 'API_KEY';

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser: (s, u) => {
      s.idToken = u.idToken;
      s.userId = u.userId;
    },
    setUserData: (s, u) => (s.user = u),
    logout: s => {
      s.idToken = null;
      s.userId = null;
      s.user = null;
    }
  },
  actions: {
    signUp: ({ commit, dispatch }, aData) => {
      axios
        .post(`/accounts:signUp?key=${API_KEY}`, {
          email: aData.email,
          password: aData.password,
          returnSecureToken: true
        })
        .then(r => {
          console.log(r);
          const data = r.data;
          commit('authUser', {
            idToken: data.idToken,
            userId: data.localId
          });

          dispatch('storeUser', aData);
          dispatch('setLogutTimer', data.expiresIn);
          dispatch('setLocalStorage', {
            idToken: data.idToken,
            userId: data.localId,
            expiresIn: data.expiresIn
          });
        })
        .catch(e => console.log(e));
    },
    signIn: ({ commit, dispatch }, aData) => {
      axios
        .post(`/accounts:signInWithPassword?key=${API_KEY}`, {
          email: aData.email,
          password: aData.password,
          returnSecureToken: true
        })
        .then(r => {
          console.log(r);
          const data = r.data;
          commit('authUser', {
            idToken: data.idToken,
            userId: data.localId
          });
          router.replace('/dashboard');
          dispatch('setLogutTimer', data.expiresIn);
          dispatch('setLocalStorage', {
            idToken: data.idToken,
            userId: data.localId,
            expiresIn: data.expiresIn
          });
        })
        .catch(e => console.log(e));
    },
    storeUser: ({ state }, uData) => {
      if (!state.idToken) {
        return;
      }

      globalAxios
        .post(`/users.json?auth=${state.idToken}`, uData)
        .then(r => console.log(r))
        .catch(e => console.log(e));
    },
    getUser: ({ commit, state }) => {
      if (!state.idToken) {
        return;
      }

      globalAxios
        .get(`/users.json?auth=${state.idToken}`)
        .then(r => {
          console.log(r);

          const users = [];
          const data = r.data;

          for (let k in data) {
            let user = data[k];
            user.id = k;
            users.push(user);
          }

          commit('setUserData', users[0]);
        })
        .catch(e => console.log(e));
    },
    logout: ({ commit }) => {
      commit('logout');
      localStorage.removeItem('idToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('extDate');
      router.replace('/signin');
    },
    setLogutTimer: ({ dispatch }, extTime) => {
      setTimeout(() => {
        dispatch('logout');
      }, extTime * 1000);
    },
    setLocalStorage: (c, d) => {
      const now = new Date();
      const extDate = new Date(now.getTime() + d.expiresIn * 1000);

      localStorage.setItem('idToken', d.idToken);
      localStorage.setItem('userId', d.userId);
      localStorage.setItem('extDate', extDate);
    },
    tryGetLocalStorage: ({ commit }) => {
      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
        return;
      }
      const extDate = localStorage.getItem('extDate');
      const now = new Date();

      if (now >= extDate) {
        return;
      }

      const userId = localStorage.getItem('userId');
      commit('authUser', { idToken, userId });
      router.replace('/dashboard');
    }
  },
  getters: {
    user: s => s.user,
    isAuthenticated: s => s.idToken != null
  }
});
