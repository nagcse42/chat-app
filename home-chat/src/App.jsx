import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { Container } from "shards-react";
import Chat from "chat/Chat";
import "./index.css";

const App = () => (
  <Container>
    <p>Welcome to chat..</p>
    <h1>Home Chat window</h1>
    <p>You go here..</p>
    <Chat />
  </Container>
);

ReactDOM.render(<App />, document.getElementById("app"));
