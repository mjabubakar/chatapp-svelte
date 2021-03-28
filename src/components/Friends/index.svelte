<script>
  import SearchBar from "../SearchBar.svelte";
  import Friend from "./friend.svelte";
  import { onMount } from "svelte";
  import {
    display,
    userName,
    profilePic,
    currentMessage,
    chatId,
    searchFriend,
    online,
  } from "../../actions/store";
  import { socket } from "../../pages/index.svelte";
  import fetcher from "../../actions/axios";
  export let res;
  let friends = res.friends;

  onMount(async () => {
    socket.on("joinchat", ({ chatId }) => {
      socket.emit("joinchat", {
        chatId,
      });
    });

    socket.on("message", async ({ profilepic, sentBy, message }) => {
      let reach = true;
      friends.map((friend, i) => {
        if (friend.username === sentBy) {
          const removed = friends.splice(i, 1);
          removed[0].seen = false;
          if (friend.username === $userName) removed[0].seen = true;
          if (i > -1) {
            removed[0].lastmessage = message;
            friends = [removed[0], ...friends];
            reach = false;
            return currentMessage.update(() => "");
          }
        }
      });

      if (reach) {
        friends = [
          {
            profilepic,
            username: sentBy,
            lastmessage: message,
            seen: $userName === sentBy,
          },
          ...friends,
        ];
        currentMessage.update(() => "");
      }
    });

    socket.on("offline", ({ username, time }) => {
      friends.map((friend) => {
        if (username === friend.username) {
          friend.online = time;
        }
      });
    });
  });

  $: if ($currentMessage) {
    let reach = true;
    friends.map((friend, i) => {
      if (friend.username === $userName) {
        if (i > -1) {
          const removed = friends.splice(i, 1);
          removed[0].lastmessage = $currentMessage;
          removed[0].seen = true;
          friends = [removed[0], ...friends];
          reach = false;
          return currentMessage.update(() => "");
        }
      }
    });

    if (reach) {
      friends = [
        {
          profilepic: $profilePic,
          username: $userName,
          lastmessage: $currentMessage,
          seen: true,
        },
        ...friends,
      ];
      currentMessage.update(() => "");
    }
  }

  const onclick = async (username, profilepic, id, chatid, isOnline) => {
    userName.update(() => username);
    chatId.update(() => chatid);
    online.update(() => isOnline);
    profilePic.update(() => profilepic);
    friends[id].seen = true;
    display.update(() => "two");
    await fetcher.post(`/seen/${username}`);
  };

  const Display = () => {
    display.update(() => "three");
  };
</script>

<div class:display={$display !== "one"} class="friends-container">
  <div class="profile">
    <div><img alt={res.username} src={res.profilepic} /></div>

    <div class="details">
      <div class="name">{res.username}</div>
      <div class="bio">{res.bio}</div>
    </div>
  </div>

  <SearchBar type="friend" />

  <div class="friends">
    <div on:click={Display} class="find">Find new friends</div>
    {#each friends as friend, id}
      {#if ($searchFriend && friend.username.includes($searchFriend) && friend.lastmessage) || (!$searchFriend && friend.lastmessage)}
        <Friend
          type="friend"
          on:click={onclick(
            friend.username,
            friend.profilepic,
            id,
            friend.chatId,
            friend.online
          )}
          {friend}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .friends-container {
    background-color: #f9f9f9;
    width: 25%;
    height: 100%;
  }

  .friends-container .profile {
    display: flex;
    flex-direction: row;
    height: 100px;
    align-items: center;
    margin: 0px 0.95em;
  }

  .friends-container .profile img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
  }

  .friends {
    height: calc(100% - 170px);
    overflow-y: auto;
  }

  .profile .details {
    color: #969698;
    padding-left: 0.5em;
    font-size: 1em;
    flex: 1;
  }

  .profile .name {
    font-size: 1em;
  }

  .name,
  .find {
    color: #0057ff;
  }

  .bio {
    font-size: 0.75em;
    max-width: 80%;
    word-break: break-word;
  }

  .find {
    display: flex;
    margin: 0.8em 0;
    justify-content: center;
  }

  @media (min-width: 800px) {
    .find {
      display: none;
    }
  }

  @media (max-width: 800px) {
    .friends-container {
      width: 100%;
    }
    .display {
      display: none;
    }
  }
</style>
<<<<<<< HEAD
=======

<div class:display={$display !== 'one'} class="friends-container">
	<div class="profile">
		<div><img alt={res.username} src={res.profilepic} /></div>

		<div class="details">
			<div class="name">{res.username}</div>
			<div class="bio">{res.bio}</div>
		</div>
	</div>

	<SearchBar type="friend" />

	<div class="friends">
		<div on:click={Display} class="find">Find new friends</div>

		{#each friends as friend, id}
			{#if ($searchFriend && friend.username.includes($searchFriend.toLowerCase()) && friend.lastmessage) || (!$searchFriend && friend.lastmessage)}
				<Friend
					type="friend"
					on:click={onclick(friend.username, friend.profilepic, id, friend.chatId, friend.online)}
					{friend} />
			{/if}
		{:else}
			<div />
		{/each}
	</div>
</div>
>>>>>>> 6785d826d2977d78f7ccd4eb103054518719f29d
