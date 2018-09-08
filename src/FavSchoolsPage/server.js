import axios from "axios";
axios.defaults.withCredentials = true;

export function getAthleteSchoolsById(userId) {
  return axios.get("/node-api/server.js/athleteSchool/" + userId);
}

export function postAthleteSchool(payload) {
  return axios.post("/node-api/server.js/athleteSchool", payload);
}

export function updateAthleteSchool(payload, Id) {
  return axios.put("/node-api/server.js/athleteSchool/" + Id, payload);
}

export function deleteAthleteSchool(Id) {
  return axios.delete("/node-api/server.js/athleteSchool/" + Id);
}

export function postAthleteSchoolTags(payload) {
  return axios.post("/node-api/server.js/athleteSchoolTags", payload);
}

export function deleteAthleteSchoolTags(id, tagName) {
  return axios.delete("/node-api/server.js/athleteSchoolTags/" + id + "?q=" + encodeURIComponent(tagName));
}

export function getAthleteTagsById(userId) {
  return axios.get("/node-api/server.js/athleteTags/" + userId);
}

export function postAthleteTags(payload) {
  return axios.post("/node-api/server.js/athleteTags", payload);
}

export function deleteAthleteTags(Id) {
  return axios.delete("/node-api/server.js/athleteTags/" + Id);
}

export function getActivitiesById(Id) {
  return axios.get("/node-api/server.js/athleteSchoolLog/" + Id);
}

export function updateActivity(payload, Id) {
  return axios.put("/node-api/server.js/athleteSchoolLog/" + Id, payload);
}

export function postActivity(payload) {
  return axios.post("/node-api/server.js/athleteSchoolLog", payload);
}

export function deleteActivity(Id) {
  return axios.delete("/node-api/server.js/athleteSchoolLog/" + Id);
}
