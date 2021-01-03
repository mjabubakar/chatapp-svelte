<script context="module">
    import Socket from "socket.io-client";

    import Container from "../components/index.svelte";
    const token = localStorage.getItem("socketToken");
    export const socket = Socket("http://localhost:3001/", {
        query: { token },
        reconnectionDelayMax: 10000,
    });

    socket.on("connect_error", (err) => {
        localStorage.removeItem("socketToken");
        localStorage.removeItem("token");
    });
</script>

<style>
    :global(body, html) {
        height: 100%;
    }
</style>

<Container />
