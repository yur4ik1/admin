import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function performSearch(search, status) {
    let variables = {
        search: search + "%",
        order: "desc",
    };
    
    let buildWhereQuery = "";
    
    if (status !== undefined) {
        buildWhereQuery = `active: {_eq: ${status}}`;
    }
    
    const query = `query getBadges($search: String, $order: order_by) {
        badges(order_by: {id: $order}, where: {${buildWhereQuery}, title: {_ilike: $search}}) {
            id
            title
        }
    }`;
    
    const data = JSON.stringify({ query, variables });
    
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + getToken()
    };
    
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: data,
    };
    
    const response = await fetch(BaseUrl, requestOptions);
    
    return await response.json();
}