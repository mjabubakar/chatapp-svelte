<script>
    import { metatags, redirect, url } from "@roxi/routify";

    import { onMount } from "svelte";

    import fetcher from "../../actions/axios.js";

    metatags.title = "Sign In";

    let token;
    onMount(() => {
        token = localStorage.getItem("token");
        if (token) {
            $redirect("/");
        }
    });

    let email;
    let password;
    let errorMessage;

    const onsubmit = async () => {
        errorMessage = "";
        if (password.length < 6) return (errorMessage = "Password too short.");
        try {
            const res = await fetcher.post("/login", {
                email,
                password,
            });
            const { userToken, socketToken } = res.data;
            localStorage.setItem("token", userToken);
            localStorage.setItem("socketToken", socketToken);
            window.location.reload();
        } catch (e) {
            errorMessage = e.response.data.message;
        }
    };
</script>

<style>
    .error {
        color: red;
        margin-bottom: 1em;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    input {
        width: 300px;
        height: 40px;
        margin-bottom: 1em;
    }

    input,
    input:focus {
        outline: none;
    }

    .btn {
        background: #0057ff;
        color: white;
        width: 200px;
        cursor: pointer;
        border-radius: 15px;
        height: 40px;
        border: none;
        margin-bottom: 1em;
    }

    .btn:focus {
        outline: none;
    }

    .text {
        width: 90%;
        text-align: center;
    }

    .text a {
        color: #0057ff;
    }

    @media (max-width: 320px) {
        input {
            width: 95%;
        }

        .btn {
            width: 70%;
        }
    }
</style>

{#if !token}
    <form>
        {#if errorMessage}
            <div class="error">{errorMessage}</div>
        {/if}
        <input
            type="email"
            placeholder="Email or Username"
            required
            bind:value={email} />
        <input
            type="password"
            bind:value={password}
            required
            placeholder="Password" />
        <button
            type="submit"
            class="btn"
            disabled={!email && password}
            on:click|preventDefault={onsubmit}>Login</button>

        <div class="text">
            <a href={$url('/signup')}> Already have an account? Sign in. </a>
        </div>
    </form>
{/if}
