<script>
    import { searchFriend, searchUser } from "../actions/store.js";

    import searchIcon from "./assets/searchicon.js";
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

    .searchbar img,
    .right {
        width: 25px;
        height: 30px;
    }

    .img {
        margin-left: 10px;
    }

    .searchbar input:focus {
        outline: none;
    }
</style>

<div class="container">
    <div class="searchbar">
        <div class="img"><img src={searchIcon} alt="search icon" /></div>
        <div class="input">
            <input
                type="text"
                bind:value={val}
                placeholder={type === 'friend' ? 'Search friends...' : 'Search for new friends...'} />
        </div>
        <div class="right" />
    </div>
</div>
