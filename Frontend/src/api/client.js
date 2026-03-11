import axios from "axios";

const client = axios.create({
  baseURL: "https://mangox-jhei.onrender.com",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: false,
});

export default client;





//mongodb+srv://eaditingsadvideo:mangox123@cluster0.u4v8gkb.mongodb.net/?appName=Cluster0