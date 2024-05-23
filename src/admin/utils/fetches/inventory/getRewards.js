import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getRewards(limit, offset, order, status, search) {
    let variables = {
        limit: limit,
        offset: offset,
        order: order
    }
    
    let whereQuery = '';
    
    if (status !== undefined) {
        whereQuery = `active: {_eq: ${status}}`;
        
        variables = {
            ...variables,
        }
    }
    
    if (search !== undefined) {
        if (whereQuery !== '') {
            whereQuery += ',';
        }
        
        whereQuery += `title: {_ilike: "${search}%"}`;
        
        variables = {
            ...variables,
        }
    }
    
    const query = `query getRewards($limit: Int, $offset: Int, $order: order_by) {
        rewards(limit: $limit, offset: $offset, order_by: {id: $order}, where: {${whereQuery}}) {
            active
            description
            id
            price
            size
            status
            title
            },
            rewards_aggregate(where: {${whereQuery}}) {
                aggregate{
                        count
                }
            }
        }`;
    
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
    
    return  await response.json();
}