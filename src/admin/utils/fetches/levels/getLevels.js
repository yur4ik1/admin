import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getLevels(order = 'asc', is_active = true) {
    let where = '';
    
    if(is_active === true) {
        where = ', where: {is_active: {_eq: true}}';
    }
    
    const data = JSON.stringify({
        query: `query MyLevels {
            levels(order_by: { id: ${order}}${where}) {
            color
            id
            is_active
            slug
            title
            }
        }`,
    });
    
    const response = await fetch(
        BaseUrl,
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + getToken()
            },
            body: data
        }
    );
    
    return await response.json();
}