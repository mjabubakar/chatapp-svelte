<script>
    import { searchFriend, searchUser } from "../actions/store.js";
    export let type;
    let val;
    $: {
        if (type === "friend") {
            searchFriend.update(() => val);
        } else {
            searchUser.update(() => val);
        }
    }
</script>

<style>
    .container {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .searchbar {
        display: flex;
        flex-direction: row;
        height: 35px;
        font-size: 1em;
        background: white;
        border-radius: 15px;
        color: #0057ff;
        margin: 0px 0.95em;
    }

    .searchbar .input {
        flex: 1;
    }

    .searchbar input {
        width: 100%;
        border: none;
    }

    .searchbar svg,
    .right {
        width: 25px;
        height: 30px;
    }

    .img {
        margin-left: 0.625em;
        display: flex;
        align-items: center;
        color: #969698;
    }

    .searchbar input:focus {
        outline: none;
    }
</style>

<div class="container">
    <div class="searchbar">
        <div class="img">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
        </div>
        <div class="input">
            <input
                type="text"
                bind:value={val}
                placeholder={type === 'friend' ? 'Search friends...' : 'Search for new friends...'} />
        </div>
        <div class="right" />
    </div>
</div>
