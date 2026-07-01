import axios from "axios";

export const commonApi = async (url, httpMethod, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpMethod,
        url: url,
        data: reqBody,
        headers: reqHeader ? { ...reqHeader } : { "Content-Type": "application/json" }
    }

    if (reqBody instanceof FormData) {
        delete reqConfig.headers["Content-Type"];
    }

    return await axios(reqConfig).then((res) => {
        return res
    }).catch((err) => {
        return err
    })
}
