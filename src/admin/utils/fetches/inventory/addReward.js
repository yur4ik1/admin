import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function addReward(json) {
    const query = `mutation insertReward($active: Boolean,$desc: String,$price: Int,$size: String,$status: Int,$title: String) {
        insert_rewards(objects: {active: $active, description: $desc, price: $price, size: $size, status: $status, title: $title}) {
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