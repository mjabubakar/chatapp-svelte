<script>
    import { goto, metatags, redirect, url } from "@roxi/routify";

    import { onMount } from "svelte";
    import fetcher from "../../actions/axios";
    import validation from "../../actions/validation";

    metatags.title = "Sign Up";
    let email;
    let password;
    let confirmPassword;
    let bio;
    let profilepic;
    let username;
    let errorMessage;

    let token;
    onMount(() => {
        token = localStorage.getItem("token");
        if (token) {
            $redirect("/");
        }
    });

    const onChange = ({ target: { files } }) => {
        const file = files[0];
        profilepic = file;
    };
    const onsubmit = async () => {
        errorMessage = "";
        const formData = new FormData();
        formData.append("profilepic", profilepic);
        formData.append("username", username);
        formData.append("bio", bio);
        formData.append("email", email);
        formData.append("password", password);
        const validationFailed = validation(
            email,
            password,
            confirmPassword,
            username,
            bio
        );
        if (validationFailed) return (errorMessage = validationFailed);

        try {
            await fetcher.post("/register", formData);
            $goto("/signin");
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

    label {
        background: #0057ff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
    }

    #input {
        display: none;
    }

    input,
    label {
        width: 300px;
        height: 40px;
        margin-bottom: 1em;
    }

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

    .text a {
        color: #0057ff;
    }

    @media (max-width: 320px) {
        input,
        label {
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
            type="text"
            placeholder="Username"
            required
            bind:value={username} />
        <input
            type="file"
            id="input"
            accept="image/*"
            required
            on:change={onChange} />
        <label
            for="input">{profilepic ? profilepic.name : 'Select Image'}</label>

        <input type="email" required placeholder="Email" bind:value={email} />
        <input type="password" bind:value={password} placeholder="Password" />
        <input
            type="password"
            bind:value={confirmPassword}
            placeholder="Confirm Password" />
        <input type="text" placeholder="Bio" bind:value={bio} />

        <button
            type="submit"
            class="btn"
            disabled={!(email && password && confirmPassword && profilepic && bio)}
            on:click|preventDefault={onsubmit}>Register</button>

        <div class="text">
            <a href={$url('/signin')}> Already have an account? Sign in. </a>
        </div>
    </form>
{/if}
