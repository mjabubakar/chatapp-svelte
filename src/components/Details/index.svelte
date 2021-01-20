<script>
	import SearchBar from "../SearchBar.svelte";
	import {
		chatId,
		display,
		online,
		profilePic,
		searchUser,
		userName,
	} from "../../actions/store";
	import fetcher from "../../actions/axios";
	import Friend from "../Friends/friend.svelte";
	import { socket } from "../../pages/index.svelte";
	import { redirect } from "@roxi/routify";
	export let users;
	const back = () => {
		if (!$userName) return display.update(() => "one");
		display.update(() => "two");
	};

	const onclick = async (username, profilepic) => {
		const { data } = await fetcher.post(`/newchat/${username}`);
		userName.update(() => username);
		chatId.update(() => data);
		profilePic.update(() => profilepic);
		online.update(() => "");
		display.update(() => "two");
		socket.emit("join", { chatId: data, username });
		await fetcher.post(`/seen/${username}`);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("socketToken");
		$redirect("/signin");
	};
</script>

<style>
	.details-container {
		background-color: #f9f9f9;
		width: 25%;
		height: 100%;
	}

	.details-container .profile {
		display: flex;
		flex-direction: column;
		font-size: 0.8em;
		align-items: center;
	}

	.users {
		height: calc(100% - 100px);
		overflow-y: auto;
	}

	.top {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
		color: #0057ff;
		margin: 0 0.95em;
		height: 50px;
	}

	.top .logout {
		cursor: pointer;
	}

	img {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}

	.profile .name {
		font-size: 1.9em;
		margin-top: 0.7em;
		margin-bottom: 0.3em;
	}

	@media (max-width: 800px) {
		.users {
			height: calc(100% - 130px);
		}
		.details-container {
			width: 100%;
		}

		.display {
			display: none;
		}
	}

	@media (min-width: 800px) {
		.top .back {
			display: none;
		}
	}
</style>

<div class:display={$display !== 'three'} class="details-container">
	<div class="top">
		<div class="back" on:click={back}>
			<svg style="width:24px;height:24px" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
			</svg>
		</div>
		<div on:click={logout} class="logout">Logout</div>
	</div>
	<SearchBar type="user" />
	{#if $searchUser}
		<div class="users">
			{#each users as user}
				{#if $searchUser && user.username.includes($searchUser.toLowerCase())}
					<Friend
						on:click={onclick(user.username, user.profilepic)}
						type="user"
						friend={user} />
				{/if}
			{/each}
		</div>
	{:else if $userName}
		<div class="profile">
			<div class="profilepic">
				<img src={$profilePic} alt={$userName} />
			</div>
			<div class="name">{$userName}</div>
			<div class="bio">This is my bio</div>
		</div>
	{/if}
</div>
