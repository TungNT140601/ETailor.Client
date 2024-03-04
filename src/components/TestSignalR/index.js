import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";

const URL = "https://etailorapi.azurewebsites.net/etailor-hub"; // Replace with your SignalR hub URL

const TestSignalR = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const manager = JSON.parse(localStorage.getItem("manager"));

  useEffect(() => {
    const options = {
      accessTokenFactory: () => manager?.token,
    };

    const transport = HttpTransportType.WebSockets;

    const connection = new HubConnectionBuilder()
      .withUrl(URL, {
        transport,
        accessTokenFactory: options.accessTokenFactory,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("messageReceived", (username, message) => {
      setMessages((prevMessages) => [...prevMessages, { username, message }]);
    });

    setConnection(connection);

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => console.log("Connection established."))
        .catch((err) =>
          console.error("Error while establishing connection:", err)
        );
    }
  }, [connection]);

  return (
    <div>
      <h1>Messages:</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestSignalR;
