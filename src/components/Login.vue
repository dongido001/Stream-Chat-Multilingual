<template>
  <div class="login">
    <div class="form">
      <form @submit.prevent="login">
        <input
          v-model="username"
          type="text"
          class="input"
          placeholder="Enter a username"
          required
        >
        <button
          type="submit"
          class="submit"
          :disabled="status === 'processing'"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: ["status"],
  data() {
    return {
      username: ""
    };
  },
  methods: {
    login() {
      this.$emit("login", this.username);
      this.username = "";
    }
  }
};
</script>
