import { call3DSpace } from "platform-connectors"

export async function call3DSpaceWithTraces(url, option) {
    let postBody = "";
    if (option && option.data) postBody = option.data;

    let method = "GET";
    if (option && option.method) method = option.method;

    if (method === "GET") console.log(`CALLING 3DSpace ${method} "${url}"`);
    else {
        console.log(`CALLING 3DSpace ${method} "${url}" with payload :`);
        console.log(postBody);
    }

    const response = await call3DSpace(url, option);

    console.log("RESPONSE from 3DSpace :");
    console.log(response);

    return response;
}