<template>
  <div class="input-area">
    <div class="input">
      <textarea
        v-if="activeChannel"
        v-model="new_message"
        class="input-message"
        placeholder="Type a message"
        rows="1"
        @keyup.shift.enter="resizeInput"
        @keyup.exact.enter="sendMessage"
      />
      <div
        v-else
        style="text-align:center"
      >
        Click on a room to start chatting...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputFrom",
  props: ["activeChannel"],
  data() {
    return {
		new_message: ""
    };
  },
  methods: {
    sendMessage(el) {
		if (!this.new_message) return;

		this.$emit("newMessage", this.new_message);
		this.new_message = "";
    },
  }
};
</script>
