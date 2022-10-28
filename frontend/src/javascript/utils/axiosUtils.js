import axios from 'axios';

export function sendRequest(url, data={}) {
  if (window.location.origin.includes("localhost")) {
    url = url.replace("BACKEND", "http://localhost:8080")
  } else {
    //url = url.replace("BACKEND", "https://algodebug.herokuapp.com")
  }
  return axios.post(url, data);
}