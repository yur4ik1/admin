import {getToken} from "../../getToken.js";
import { BaseUrl } from "../../constants.js";

export async function getLevels() {
    let query = `query MyLevels {
                    levels(order_by: { id: asc }) {
                    id
                    title
                    }
                }`
    
    let variables = {}
    const data = JSON.stringify({query, variables});
    
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