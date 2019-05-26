<template>
  <div class="channel-wrapper">
		<div class="new-channel">
			<input 
			  type="text" 
				placeholder="Create channel" 
				class="input-search" 
				v-model="chan"
			/>
			<input 
				type="button" 
				value="Create Channel" 
				class="new-channel-btn"
				@click="createChannel"
			>
		</div>
    <div class="channels">
        <div
			class="channel"
			v-for="(channel, ind) in channels"
			:key="ind"
			@click="joinChannel(channel)"
			:class="activeChannel.cid === channel.cid ? 'active_room' : ''"
		>
			{{ channel.data.name || channel.data.id }}
		</div>
    </div>
  </div>
</template>

<script>
export default {
	name: "channels",
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
