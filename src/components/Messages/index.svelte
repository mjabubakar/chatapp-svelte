<script>
  import { afterUpdate, beforeUpdate, onMount } from "svelte";
  import { socket } from "../../pages/index.svelte";
  import fetcher from "../../actions/axios.js";
  import {
    chatId,
    currentMessage,
    display,
    myUsername,
    online,
    profilePic,
    userName,
  } from "../../actions/store.js";
  import { getTime, hoursAgo, time } from "../../actions/time";
  import Typing from "./typing.svelte";
  const back = () => {
    display.update(() => "one");
  };
  const next = () => {
    display.update(() => "three");
  };

  let message;
  let div;

  const onSend = async () => {
    const msg = message;
    messages = [
      ...messages,
      { message, sentBy: $myUsername, time: new Date(), sent: false },
    ];
    currentMessage.update(() => msg);
    message = "";
    try {
      await fetcher.post(`/sendmessage/${$userName}`, {
        message: msg,
      });
      messages[messages.length - 1].sent = true;
    } catch (e) {}

    socket.emit("sendmessage", {
      username: $userName,
      message: msg,
      time: new Date(),
      chatId: $chatId,
      profilepic: $profilePic,
    });

    socket.emit("typing", {
      IsTyping: false,
      username: $myUsername,
      chatId: $chatId,
    });
  };

  let autoscroll;

  beforeUpdate(() => {
    autoscroll =
      div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
  });
  afterUpdate(async () => {
    await loading;
    if (autoscroll) div.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  let userIsTyping = false;

  onMount(() => {
    socket.on("message", (data) => {
      if (data.username === $myUsername) {
        messages = [...messages, data];
        fetcher.post(`/seen/${$userName}`);
      }
    });

    socket.on("online", ({ username }) => {
      if (username === $userName) {
        online.update(() => "Online");
      }
    });

    socket.on("offline", ({ username, time }) => {
      if (username === $userName) {
        online.update(() => time);
      }
    });

    socket.on("istyping", ({ username, IsTyping }) => {
      if (username === $userName) {
        userIsTyping = IsTyping;
      }
    });
  });

  let timeout = undefined;
  let IsTyping = false;

  const notTyping = () => {
    IsTyping = false;
    socket.emit("typing", {
      IsTyping,
      username: $myUsername,
      chatId: $chatId,
    });
  };

  const oninput = () => {
    if (!IsTyping) {
      IsTyping = true;
      socket.emit("typing", {
        IsTyping,
        username: $myUsername,
        chatId: $chatId,
      });
      timeout = setTimeout(notTyping, 4000);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(notTyping, 4000);
    }
  };

  const getMessages = async () => {
    const { data } = await fetcher.get(`/messages/${$userName}`);
    messages = data;
  };
  let messages = [];
  let loading;

  $: if ($userName) {
    loading = getMessages();
    fetcher.post(`/seen/${$userName}`);
  }
  let height = {};
</script>

<div class:display={$display !== "two"} class="messages-container">
  <div class="container">
    <div class="profile">
      <div class="back" on:click={back}>
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
          />
        </svg>
      </div>
      <div class="profilepic">
        <img src={$profilePic} alt={$userName} />
      </div>
      <div class="side">
        <div class="name">{$userName}</div>

        {#if !$online}
          <div />
        {:else if !hoursAgo($online)}
          <div />
        {:else if $online !== "Online"}
          <div class="online">Active {hoursAgo($online)}</div>
        {:else}
          <div class="online">Active now</div>
        {/if}
      </div>
      <div on:click={next} class="next">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
          />
        </svg>
      </div>
    </div>

    <hr />

    <div class="main">
      <div class="messages">
        {#await loading}
          <div>Loading...</div>
        {:then res}
          {#each messages as message, i}
            <div bind:this={div}>
              {#if i === 0 || messages[i - 1].sentBy !== messages[i].sentBy || getTime(messages[i - 1].time) !== getTime(messages[i].time)}
                <div class="time">
                  {getTime(messages[i].time) + ", " + time(messages[i].time)}
                </div>
              {/if}
              {#if message.sentBy === $userName}
                <div class="from">
                  <div class="profilepic">
                    {#if i === messages.length - 1 || messages[i + 1].sentBy !== $userName || getTime(messages[i + 1].time) !== getTime(messages[i].time)}
                      <img src={$profilePic} alt={message.username} />
                    {/if}
                  </div>
                  <div class="message-container">
                    <div class="message">
                      {message.message}
                    </div>
                  </div>
                </div>
              {:else}
                <div class="to">
                  <div bind:clientHeight={height[i]} class="message-container">
                    <div class="message">
                      {message.message}
                    </div>
                  </div>
                  {#if message.sent === false}
                    <div class="sent" style="height: {height[i]}px">
                      <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M2,21L23,12L2,3V10L17,12L2,14V21Z"
                        />
                      </svg>
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {:else}
            <div />
          {/each}
          {#if userIsTyping}
            <div class="from typing">
              <div class="profilepic" />

              <div class="message-container">
                <div class="message">
                  <Typing />
                </div>
              </div>
            </div>
          {/if}
        {/await}
      </div>
      <div class="send-message">
        <form on:submit|preventDefault={onSend} class="input">
          <input
            placeholder="Send message..."
            bind:value={message}
            on:input={oninput}
            required
            type="text"
          />
        </form>
        <div class="icon" on:click={onSend}>Send</div>
      </div>
    </div>
  </div>
</div>

<style>
  .messages-container {
    width: 50%;
    overflow: hidden;
  }

  .messages-container .container {
    margin: 0 0.63em;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .messages-container .profile {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    margin-top: 0.5em;
  }

  .profile .side {
    margin-left: 10px;
    font-size: 0.6rem;
    flex: 1;
  }

  .name {
    font-size: 1rem;
  }

  .profile img {
    width: 40px;
    border-radius: 50%;
    height: 40px;
  }

  .profile .back {
    color: #0057ff;
    margin-right: 1em;
  }

  .profile .next {
    color: #0057ff;
    margin-left: 0.5em;
  }

  hr {
    border: 1px solid #f4f4f5;
  }

  .main {
    height: 100%;
    flex: 1;
    width: 100%;
    overflow: hidden;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
  }

  .message-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    max-width: 70%;
  }

  .time {
    text-align: center;
    width: 100%;
    font-size: 0.6em;
    color: #96959a;
    margin: 0.5em 0;
  }

  .messages .to {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
    align-items: flex-end;
  }

  .messages .to,
  .messages .from {
    word-break: break-all;
  }

  .to .sent {
    color: #0057ff;
    display: flex;
    align-items: center;
    margin-bottom: 1%;
  }

  .messages .from {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: flex-end;
  }

  .messages .from.typing .message-container .message {
    padding: 0 0.8em;
    height: 28px;
    display: flex;
    align-items: center;
  }

  .messages .from .message-container,
  .to .message-container {
    margin-bottom: 0.4em;
  }

  .messages-container .message {
    color: white;
    border-radius: 7px;
    background: #0057ff;
    font-size: 0.9em;
    padding: 0.3em 0.6em;
    padding-top: 0.3em;
    max-width: 100%;
  }

  .from .message-container .message {
    background: #f9f9f9;
    color: #96959a;
    border-radius: 7px;
  }

  .send-message {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
  }

  .send-message .input {
    width: 80%;
  }

  .send-message div {
    height: 40px;
    margin-top: 1em;
    color: #0057ff;
  }

  .send-message input {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-color: #f9f9f9;
    border: hidden;
    padding-left: 1em;
  }

  .send-message input:focus {
    outline: none;
  }

  .from {
    display: flex;
    flex-direction: row;
  }

  .messages .profilepic {
    width: 30px;
    height: 30px;
  }

  .messages .profilepic img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }

  @media (max-width: 800px) {
    .messages-container {
      width: 100%;
    }

    .display {
      display: none;
    }
  }

  @media (min-width: 800px) {
    .next {
      display: none;
    }

    .back {
      display: none;
    }
  }
</style>
