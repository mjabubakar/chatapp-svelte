# CHATAPP

ChatApp built with Svelte and [ChatAPI](https://github.com/mjabubakar/chatapi). 

#### Features

-  Typing indicator when ever a friend is typing.
-  Indicates if a friend is online.
-  User sign in and sign up.
-  Receiving messages in realtime with socket.io.
-  Checks if message is sent.



###### Make sure to write your API URL in src/actions/axios

### npm scripts

| Syntax           | Description                                                                       |
|------------------|-----------------------------------------------------------------------------------|
| `dev`            | Development (port 5000)                                                           |
| `dev:nollup`     | Development with crazy fast rebuilds (port 5000)                                  |
| `dev-dynamic`    | Development with dynamic imports                                                  |
| `build`          | Build a bundled app with SSR + prerendering and dynamic imports                   |
| `serve`          | Run after a build to preview. Serves SPA on 5000 and SSR on 5005                  |
| `deploy:*`       | Deploy to netlify or now                                                          |
| `export`         | Create static pages from content in dist folder (used by `npm run build`)         |
