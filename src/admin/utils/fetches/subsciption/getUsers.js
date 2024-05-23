import {BaseUrl} from '../../constants.js';
import {getToken} from "../../getToken.js";

export async function getUsers() {
    let query = `query getUsers {
                            users_aggregate(where: {active: {_eq: true}}) {
                                aggregate {
                                    count
                                }
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