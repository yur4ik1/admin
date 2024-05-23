import {getToken} from "../../getToken.js";
import {BaseUrl} from "../../constants.js";

export async function performSearch(search, status) {
    let variables = {
        search: search + "%",
        order: "desc",
    };
    
    let statusQuery = '';
    
    if (status !== undefined) {
        statusQuery = `, status: {_eq: ${status}}`;
        
        variables = {
            ...variables,
            status: status
        };
    }
    
    const query = `query getRewards($search: String, $order: order_by) {
        rewards(order_by: {id: $order}, where: {title: {_ilike: $search} ${statusQuery}}) {
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
        /*signal: abortControllerFilter.signal*/
    };
    
    const response = await fetch(BaseUrl, requestOptions);
    
    return await response.json();
}