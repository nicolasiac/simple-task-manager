<template>
  <nav class="navbar navbar-light bg-light">
    <div v-if="user != null">
      <span>{{  user }} </span>
    </div>
    <span class="navbar-brand mb-0 h1">{{title}}</span>
  </nav>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      title: 'Invoicing App',
      user: this.$route.params.user 
    }
  },
  mounted(){
    this.user = JSON.parse(localStorage.getItem("user"));
  }
}
</script>
