import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getAllUsers() {
    let variables = {
        active: true
    }
    
    let query = `query getUsers($active: Boolean, $order: order_by = asc) {
        users(order_by: {id: $order}, where: {active: {_eq: $active}}) {
        firstname
        lastname
        id
        status
        }
      }`
    
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