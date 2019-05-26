<template>
	<div id="app">
		<div v-if="!authenticated">
			<Login @login="setAuthenticated"/>
		</div>
		<div class="main" v-else>
			<Channels 
			    @joinChannel="setActiveChannel"
				:channels="channels"
				@createChannel="createChannel"
			/>
			<div class="message-area">
				<div class="message-header">
					<div class="message-header-left"> Chatx </div>
					<div class="message-header-right">
						<select v-model="language" class="language" @change="translateLanguage">
							<option value="en" selected> English </option>
							<option value="fr"> French </option>
							<option value="de"> German </option>
						</select>
					</div>
				</div>
				<Messages 
				    :messages="messages" 
                    :userId="userId"
				/>
				<InputForm
					@newMessage="sendMessage"
					@joinedRoom="joinedRoom = true"
					:activeChannel="activeChannel"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { StreamChat } from 'stream-chat';
import axios from "axios";

import Messages from "@/components/Messages";
import InputForm from "@/components/InputForm";
import Channels from "@/components/Channels";
import Login from "@/components/Login";

import "./App.css";

export default {
  name: "app",
  components: {
    Messages,
    InputForm,
    Channels,
    Login
  },
  data() {
    return {
      messages: [],
      authenticated: false,
      channels: [],
      activeChannel: null,
	  status: null,
	  userId: null,
	  language: "en"
    };
  },
  methods: {
    async setAuthenticated(userId) {
		const response = await axios.post(`${process.env.VUE_APP_SERVER}/login`, {userId})
		
		if (response.data.status === 'success') {
			this.authenticated = false
			this.token = response.data.token
			this.userId = userId

			this.initializeClient().then( () => {
				this.authenticated = true
				this.getChannels() 
			})
		}
    },
    async initializeClient () {
		// Initialize the StreamChat SDK
		const client = new StreamChat(process.env.VUE_APP_KEY);

		await client.setUser(
			{
				id: this.userId,
				name: this.userId,
			},
			this.token,
		);

		this.client = client
	},
	setActiveChannel (channel) {
		// Before changing the active channel,
		// Stop listening to event from the previous one
		if (this.activeChannel) {
			this.activeChannel['listeners']['message.new'] = []
		} 
	
		channel.state.messages.forEach( async message => {
			try {
				const { data, status} = await axios.post(`${process.env.VUE_APP_SERVER}/translate`, {
					targetLanguage: this.language,
					text: message.text
				})
				this.messages.push({...message, text: data.TranslatedText})
			} catch (e) {
                this.messages.push(message)
			}
		})

		//  Listen for new messages
		this.activeChannel = channel

		channel.on('message.new', async event => {
			try {
				const { data, status } = await axios.post(`${process.env.VUE_APP_SERVER}/translate`, {
					targetLanguage: this.language,
					text: event.message.text
				})
				this.messages.push({...event.message, text: data.TranslatedText})
			} catch (e) {
                this.messages.push(event.message)
			}
		});
	},
    async createChannel (channelName) {
		const channel = this.client.channel('messaging', channelName, {
			name: channelName
		});

		this.channels.push(channel)
    },
    async getChannels () {
		const filter = {};
		const sort = {};

		const channels = await this.client.queryChannels(filter, sort, {
			watch: true,
			state: true,
		});

		this.channels = channels
	},
    async sendMessage (message) {
		this.activeChannel && await this.activeChannel.sendMessage({
			text: message
		});
	},
	translateLanguage () {
		const translatedMessage = []
        this.messages.forEach( async message => {
		    const {data, status} = await axios.post(`${process.env.VUE_APP_SERVER}/translate`, {
			   targetLanguage: this.language,
			   text: message.text
			})

			translatedMessage.push({...message, text: data.TranslatedText})
	    })

	    this.messages = translatedMessage
	}
  },
};
</script>

