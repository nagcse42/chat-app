import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useSubscription,
  useMutation,
  gql
} from "@apollo/client";

import { Container, Row, Col, FormInput, Button } from "shards-react";
import { WebSocketLink } from "@apollo/client/link/ws";

const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/",
  cache: new InMemoryCache()
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);

  if (!data) {
    return null;
  }

  return (
    <div>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1rem"
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5rem",
                border: "2px solid #e5e6ea",
                borderRadius: 25,
                textAlign: "center",
                fontSize: "18pt",
                paddingTop: 5
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div
            style={{
              background: user === messageUser ? "#58bf56" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1rem",
              borderRadius: "1rem",
              maxWidth: "60%"
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  const [state, setUserData] = React.useState({
    user: "Nag",
    content: ""
  });

  const [postMessage] = useMutation(POST_MESSAGE);

  const sentMessage = () => {
    if (state.content.length > 0) {
      postMessage({ variables: state });
    }

    setUserData({
      ...state,
      content: ""
    });
  };

  return (
    <div>
      <Container>
        <Messages user="Nag" />
        <Row>
          <Col xs={2} style={{ padding: 0 }}>
            <FormInput
              label="User"
              value={state.user}
              onChange={event =>
                setUserData({
                  ...state,
                  user: event.target.value
                })
              }
            ></FormInput>
          </Col>
          <Col xs={8}>
            <FormInput
              label="Content"
              value={state.content}
              onChange={event =>
                setUserData({
                  ...state,
                  content: event.target.value
                })
              }
              onKeyUp={event => {
                if (event.keyCode === 13) {
                  sentMessage();
                }
              }}
            ></FormInput>
          </Col>
          <Col xs={2} style={{ padding: 0 }}>
            <Button onClick={() => sentMessage()}>Send</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
