<script setup>

import Message from './components/Message.vue';
import images from './assets/index.js';
import { onMounted, ref, computed, watch } from 'vue';
import getMessages from './functions/getMessages.js';
import Recorder from './classes/Recorder.js';

const { profilePhoto, phone, video, upload, camera, image, voice, smile, send, hearth } = images;

const messages = ref({});
const userId = ref("1");
const recorder = ref(null);

const contentToSend = ref({
	audio: null,
	image: null,
	text: null,
	file: null,
	video: null,
});

async function handleSend() {

	if (contentToSend.value.audio || contentToSend.value.video) {
		
		recorder.value.stop();

		let media = await recorder.value.getMedia();

		media.mediaElement.play();

	}

	contentToSend.value = {
		audio: null,
		image: null,
		text: null,
		file: null,
		video: null,
	};
}

async function startRecordingHandler(sources) {
	if (sources.video) {
		contentToSend.value.video = "recording";
	}
	else if (sources.audio) {
		contentToSend.value.audio = "recording";
	}

	console.log(arguments);

	recorder.value = new Recorder(sources);
	await recorder.value.start();

}

//computed properties

const isVideoRecording = computed(() => {
	return contentToSend.value.video === "recording";
});

const isAudioRecording = computed(() => {
	return contentToSend.value.audio === "recording";
});

const haveContentToSend = computed(() => {
	return contentToSend.value.audio || contentToSend.value.image || contentToSend.value.text || contentToSend.value.file || contentToSend.value.video;
});

//watchers

watch(contentToSend, (newVal, oldVal) => {
	console.log(newVal);
});

//mounted

onMounted(async () => {
	messages.value = await getMessages();
});


</script>

<template>
	
	<div class="cont">
		<div v-if="isVideoRecording" >
			<video muted autoplay id="video-prew"></video>
		</div>
		<header>

			<div class="left">
				<img :src="profilePhoto" alt="">
			</div>

			<div class="center">
				<h3>Nikola Matković</h3>
			</div>

			<div class="right">
				<img :src="phone" alt="">
				<img :src="video" alt="">
				<div class="dots">
					<div class="dot"></div>
					<div class="dot"></div>
					<div class="dot"></div>
				</div>
			</div>

		</header>
		<main>
			<Message :userId="userId" v-for="message in messages" :key="message.id" :message="message" />
		</main>
		<footer>
			<div class="file">
				<img :src="upload" alt="">
			</div>
			<div class="camera" @click="startRecordingHandler({audio: true, video: true})">
				<img :src="camera" alt="">
			</div>
			<div class="image">
				<img :src="image" alt="">
			</div>
			<div ref="voiceElement" class="voice" @click="startRecordingHandler({audio: true, video: false})">
				<img :src="voice" alt="">
			</div>
			<div class="text">
				<textarea v-model="contentToSend.text" @change="handleChange"></textarea>
				<div class="smile">
					<img :src="smile" alt="">
				</div>
			</div>
			<div class="send">
				<div @click="handleSend" v-if="haveContentToSend" class="send">
					<img :src="send" alt="">
				</div>
				<div v-else class="hearth-icon">
					<img :src="hearth" alt="">
				</div>
			</div>
		</footer>
	</div>
</template>

<style lang="scss">

:root{
	--profile-image-size: 50px;
	--header-padding-size: 5px;
	--icons-size : 20px;
	--header-size : calc(var(--profile-image-size) + var(--header-padding-size) * 2); 
}

#app{
	width: 100vw;
	height: 100vh;
	display: grid;
	place-items: center;
}

header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--header-padding-size);
	padding : var(--header-padding-size) 30px;
	background: hsl(261, 100%, 80%);
	color: white;
	font-size: 15px;
    vertical-align: baseline;
    white-space: pre-wrap;
    color: rgb(17, 27, 33);
    line-height: 20px;

    .left img{
		width: var(--profile-image-size);
		height: var(--profile-image-size);
		border-radius: 50%;
		object-fit: cover;
		cursor: pointer;
	}

	.center h3{
		font-size: 20px;
		letter-spacing: 2px;
		color: rgb(24, 24, 24);
	}

	.right{
		display: flex;
		justify-content: space-between;
		align-items: center;
	
		img {
			width: var(--icons-size);
			height: var(--icons-size);
			margin-right: 10px;	
			cursor: pointer;
		}

	    .dots{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			width: 20px;
			height: 20px;
			cursor: pointer;
		}
		.dot {
			width: 5px;
			height: 5px;
			border-radius: 50%;
			background-color: black;
		}
	}
}

.cont {
	width: 470px;
	height: 100%;
	border: 1px solid black;
	border-radius: 10px;
	overflow: hidden;
	display: grid;
	grid-template-rows: var(--header-size) 1fr 50px;
	resize: both;
	position: relative;
}

main {
	display: flex;
	flex-direction: column;
	height: auto;
	flex-shrink: 0;
	overflow-y: auto;
	gap: 10px;
	padding: 10px;
	background-color: rgb(22, 22, 22);
}

::-webkit-scrollbar {
	width: 5px;
	background-color: rgb(131, 131, 184);
}

::-webkit-scrollbar-button {
	width: 0px;
	height: 0px;
}

::-webkit-scrollbar-thumb {
	background-color: rgb(208, 0, 0);
	width: 5px;
	height: 100px;
}

footer {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	gap: 20px;
	padding: 0 10px;
	background-color: rgb(255, 255, 255);
	height: 50px;

	img {
		width: 30px;
		height: 30px;
		cursor: pointer;
	}
	.text {
		position: relative;
		height: 40px;
		display: flex;
		justify-self: center;
		align-items: center;
	}
	textarea {
		width: 100%;
		height: 40px;
		border-radius: 20px;
		border: none;
		outline: none;
		resize: none;
		padding: 10px;
		padding-right: 50px;
	}

	.text .smile {
		position: absolute;
		right: 5px;
		bottom: 20px;
		transform: translateY(50%);
		height: 30px;
	}
}

textarea::-webkit-scrollbar{
	width: 0px;
	height: 0px;
}
textarea::-webkit-scrollbar-thumb{
	background: transparent;
	border: none;
}

#video-prew{
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background: red;
	z-index: 2;
}

</style>
