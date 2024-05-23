import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function performSearch(search, status) {
    let variables = {
        // search: search + "%",
        order: "desc",
    };
    
    let builtQuery = ``;
    
    if (search || status) {
        if (search && search !== '') {
            builtQuery += `lastname: {_ilike: "${search + '%'}"}`;
        }
        if (status && status !== '') {
            if (search && search !== '') builtQuery += `, `;
            
            let statusQuery = status ? 1 : 0;
            
            builtQuery += `status: {_eq: ${statusQuery}}`;
        }
    }
    
    const query = `query getUsers($order: order_by , $status: Int) {
    users(order_by: {id: $order}, where: {${builtQuery}}) {
        firstname
        id
        lastname
        }
    }`;
    
    const data = JSON.stringify({query, variables});
    
    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + getToken()
    };
    
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: data
    };
    
    const response = await fetch(BaseUrl, requestOptions);
    
    return await response.json();
}