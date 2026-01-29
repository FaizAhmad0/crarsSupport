// sseManager.js
const managerClients = new Map(); // managerId -> response

// Add manager to connected clients
const addManager = (managerId, res) => {
  managerClients.set(managerId.toString(), res);
  console.log("Manager connected:", managerId);
};

// Remove manager when disconnected
const removeManager = (managerId) => {
  managerClients.delete(managerId.toString());
  console.log("Manager disconnected:", managerId);
};

// Notify a specific manager
const notifyManager = (managerId, data) => {
  console.log("Trying to notify manager:", managerId);
  console.log("Connected managers:", Array.from(managerClients.keys()));

  const client = managerClients.get(managerId.toString());
  if (client) {
    console.log("Sending data to manager:", data);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  } else {
    console.log("Manager not connected, cannot send data");
  }
};

module.exports = {
  addManager,
  removeManager,
  notifyManager,
};
