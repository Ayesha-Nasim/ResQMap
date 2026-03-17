import axios from "axios";
import { getLocalIP } from "../utils/getLocalIP";

const PROD_URL = "https://resqmap-backend-gon7.onrender.com/api";

let api = axios.create({
  baseURL: PROD_URL,
  timeout: 30000,
});

export function initApi() {
  try {
    const isDev = __DEV__ === true;

    if (!isDev) {
      console.log("🌐 Using PRODUCTION backend:", PROD_URL);
      return;
    }

    const ip = getLocalIP();
    const localURL = `http://${ip}:5000/api`;

    api = axios.create({
      baseURL: localURL,
      timeout: 30000,
    });

    console.log("🌐 Using LOCAL Backend:", localURL);
  } catch (err) {
    console.log("⚠️ Auto-detection failed, using production");
  }
}

export { api };