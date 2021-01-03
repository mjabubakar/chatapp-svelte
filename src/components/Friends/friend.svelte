<script>
    import { userName } from "../../actions/store";

    export let friend;
    export let type;
</script>

<style>
    .friend {
        display: flex;
        flex-direction: row;
        color: #969698;
        font-size: 0.7em;
        height: 60px;
        margin-bottom: 1.5em;
        cursor: pointer;
        padding: 0 0.95em;
        align-items: center;
    }

    .current {
        background: white;
    }

    .profilepic img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .friend .details {
        margin-left: 0.7em;
        flex: 1;
        padding-right: 0.3em;
    }

    .details .lastmessage {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 0.2em;
        overflow: hidden;
        line-height: 1.2em;
        max-width: 100%;
        word-break: break-all;
    }

    .details,
    .side {
        /* margin-top: 0.2em; */
        height: 90%;
    }

    .friend .name {
        font-size: 1.4em;
    }

    .friend .dot-container {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .friend .dot {
        background-color: #0057ff;
        width: 5px;
        height: 5px;
        border-radius: 50%;
    }

    .bold {
        font-weight: bold;
    }

    .side {
        display: flex;
        flex-direction: column;
        margin-bottom: 1em;
    }
</style>

<div on:click class:current={friend.username === $userName} class="friend">
    <div class="profilepic">
        <img src={friend.profilepic} alt={friend.username} />
    </div>
    {#if type === 'user'}
        <div class="details">
            <div class="name">{friend.username}</div>
        </div>
    {:else if type === 'friend'}
        <div class="details">
            <div class="name">{friend.username}</div>

            <div class:bold={!friend.seen} class="lastmessage">
                {friend.lastmessage}
            </div>
        </div>

        <div class="side">
            {#if !friend.seen}
                <div class="dot-container">
                    <div class="dot" />
                </div>
            {/if}
        </div>
    {/if}
</div>
