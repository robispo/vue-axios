<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    created() {
      axios
        .get('https://robispo-vue-axios.firebaseio.com/users.json')
        .then(r => console.log(r))
        .catch(e => console.log(e));
    }
  };
</script>

<style scoped>
  h1,
  p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>
