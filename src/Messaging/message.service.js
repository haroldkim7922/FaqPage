import axios from "axios";

export function getMessagesByUserId(recipientUserId) {
  return axios.get("/node-api/server.js/messages/" + recipientUserId);
}

export function getConvosByUserId() {
  return axios.get("/node-api/server.js/messages");
}

export function postMessage(payload) {
  return axios.post("/node-api/server.js/messages", payload);
}

export function getContacts(id) {
  return axios.get("/node-api/server.js/follow/mutual/" + id);
}
