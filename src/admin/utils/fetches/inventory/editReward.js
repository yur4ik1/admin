import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editReward(json) {
    const query = `mutation editReward($id: Int, $active: Boolean, $desc: String, $price: Int, $size: String, $status: Int, $title: String) {
        update_rewards(where: {id: {_eq: $id}}, _set: {active: $active, description: $desc, price: $price, size: $size, status: $status, title: $title}) {
            returning {
                active
                description
                id
                price
                size
                status
                title
            }
        }
    }`;
    
    let variables = {
        id: json.id,
        active: json.status,
        title: json.title,
        desc: json.description,
        size: json.size.toUpperCase(),
        price: json.price,
        status: 1
    }
    
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