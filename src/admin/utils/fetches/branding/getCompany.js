import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getCompany() {
    let query = `query getCompany {
                company {
                    url
                }
            }`;
    
    let variables = {};
    
    const data = JSON.stringify({ query, variables });
    
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + getToken()
    };
    
    const response = await fetch(
        BaseUrl,
        {
            method: 'post',
            headers,
            body: data
        }
    );
    
    return await response.json();
}