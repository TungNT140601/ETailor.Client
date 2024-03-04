import * as signalR from "@microsoft/signalr";

const TestSignalR = () => {
  const URL = "https://etailorapi.azurewebsites.net/chatHub"; // Replace with your SignalR hub URL

  const manager = JSON.parse(localStorage.getItem("manager"));
  const connectionInit = async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(URL, {
        accessTokenFactory: () => manager?.token, // Function to retrieve JWT token
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveMessage", (message) => {
      console.log("Received message:", message);
      // Handle the received message
    });

    await connection
      .start()
      .then(() => console.log("Connected to SignalR hub"));
    // await connection.invoke();
  };
  connectionInit();
};

export default TestSignalR;
