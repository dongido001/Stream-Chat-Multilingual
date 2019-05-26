<template>
  <div class="channel-wrapper">
    <div class="new-channel">
      <input 
        v-model="chan" 
        type="text" 
        placeholder="Create channel" 
        class="input-search"
      >
      <input 
        type="button" 
        value="Create Channel" 
        class="new-channel-btn"
        @click="createChannel"
      >
    </div>
    <div class="channels">
      <div
        v-for="(channel, ind) in channels"
        :key="ind"
        class="channel"
        :class="activeChannel.cid === channel.cid ? 'active_room' : ''"
        @click="joinChannel(channel)"
      >
        {{ channel.data.name || channel.data.id }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: "Channels",
	props: ["channels"],
	data() {
		return {
			activeChannel: {},
			chan: ""
		};
	},
	methods: {
		joinChannel (channel) {
			this.activeChannel = channel;
			this.$emit('joinChannel', channel);
		},
		createChannel () {
			this.$emit('createChannel', this.chan)
			this.chan = ''
		}
	}
};
</script>
