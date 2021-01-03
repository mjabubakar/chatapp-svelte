<script>
	import { metatags, redirect } from "@roxi/routify";
	import { onMount } from "svelte";
	import fetcher from "../actions/axios";
	import { myUsername, userName } from "../actions/store";
	import Details from "./Details/index.svelte";
	import Friends from "./Friends/index.svelte";
	import Messages from "./Messages/index.svelte";

	metatags.title = "Chat App";
	metatags.description = "Chat app built with Svelte";
	let auth = false;
	let users = [];
	const fetchFriends = async () => {
		const { data } = await fetcher.get("/chats");
		return data;
	};

	let chat = fetchFriends();
	onMount(async () => {
		try {
			await fetcher.get("/verify");
			auth = true;
			const { data } = await fetcher.get("/users");
			users = data;
			chat = fetchFriends();
			const { username } = await chat;
			myUsername.update(() => username);
		} catch (e) {
			$redirect("/signin");
		}
	});
</script>

<style>
	.chat-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		bottom: 0;
	}

	.container {
		width: 50%;
	}

	.spinner {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 98vh;
	}

	@media (max-width: 800px) {
		.container {
			display: none;
		}
	}
</style>

<div>
	{#if auth}
		{#await chat}
			<div class="spinner">Loading....</div>
		{:then res}
			<div class="chat-container">
				<Friends {res} />
				{#if $userName}
					<Messages />
					<Details {users} />
				{:else}
					<div class="container" />
					<Details {users} />
				{/if}
			</div>
		{/await}
	{/if}
</div>
