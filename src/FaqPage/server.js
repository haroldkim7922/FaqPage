import axios from "axios";
axios.defaults.withCredentials = true;

export function getAllFaqs() {
  return axios.get("/node-api/server.js/faqs");
}

export function getFaqsbyCategory(categoryId) {
  return axios.get("/node-api/server.js/faqs/" + categoryId);
}

export function searchFaq(pageIndex, pageSize, searchVal) {
  return axios.get(
    "/node-api/server.js/faqs/search/" +
      pageIndex +
      "/" +
      pageSize +
      "?q=" +
      encodeURIComponent(searchVal)
  );
}

export function postFaq(payload) {
  return axios.post("/node-api/server.js/faqs", payload);
}

export function updateFaq(payload, faqId) {
  return axios.put("/node-api/server.js/faqs/" + faqId, payload);
}

export function deleteFaq(faqId) {
  return axios.delete("/node-api/server.js/faqs/" + faqId);
}

export function getAllFaqCategories() {
  return axios.get("/node-api/server.js/faqsCategories");
}

export function postFaqCategory(payload) {
  return axios.post("/node-api/server.js/faqsCategories", payload);
}

export function updateFaqCategory(payload, faqCategoryId) {
  return axios.put(
    "/node-api/server.js/faqsCategories/" + faqCategoryId,
    payload
  );
}

export function deleteFaqCategory(faqCategoryId) {
  return axios.delete("/node-api/server.js/faqsCategories/" + faqCategoryId);
}
