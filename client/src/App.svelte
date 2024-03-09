<script lang="ts">
  import PusherJS from "pusher-js";
  import { onMount } from "svelte";
  const client = new PusherJS("app-key", {
    wsHost: "127.0.0.1",
    cluster: "",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  let emails: { subject: string; sender: string }[] = [];
  const updateEmails = async () => {
    const res = await (await fetch("http://localhost:3000/emails")).json();
    emails = res;
  };
  client.subscribe("emails").bind("received", () => updateEmails());
  onMount(() => {
    updateEmails();
  });
</script>

<main>
  <h1>Emails Received</h1>
  <button on:click={() => updateEmails()}>Refresh</button>
  {#each emails as email}
    <div>
      <h2>{email.subject}</h2>
      <p>{email.sender}</p>
    </div>
  {/each}
</main>

<style>
  :global(body, html) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  :global(:root) {
    background-color: #0b0b0b;
    color: #fff;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
  }

  main {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  button {
    padding: 3px 4px;
    width: 100px;
    border: none;
    outline: none;
    background-color: aquamarine;
    font-weight: bold;
    font-size: larger;
  }
  div {
    border: 1px solid #fff;
  }
</style>
