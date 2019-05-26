<template>
  <div ref="messages" class="messages">
    <div v-for="(message, ind) in messages" :key="ind">
      <div
        :class="[
          'message-container message',
          messageDirection(message, 'float-')
        ]"
      >
        <div class="chat-name">{{ message.user.name }}</div>
        <div>
          {{ message.text}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "messages",
  props: ["messages", "userId"],
  methods: {
    messageDirection(message, css = "") {
      return message.user.id !== this.userId
        ? `${css}left`
        : `${css}right`;
    }
  },
  updated() {
    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
  }
};
</script>
