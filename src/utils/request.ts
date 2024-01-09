import axios from "axios";
import {Modal} from 'antd'
import ReactDOM from "react-dom/client";

const instance = axios.create({
    baseURL: 'https://api-v2.xdclass.net',
    headers: {
        Token: window.localStorage.getItem("token")
    }
})

// @ts-ignore
instance.interceptors.response.use((res) => {
    return res
})

export default instance