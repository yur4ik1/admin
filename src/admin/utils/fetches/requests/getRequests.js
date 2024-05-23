import { BaseUrl } from '../../constants.js';
import {getToken} from "../../getToken.js";

export async function getRequests(limit, offset, order, status) {
    let variables = {
        limit: limit,
        offset: offset,
        order: order
    }
    
    let whereQuery = '';
    
    if (status !== undefined) {
        whereQuery = `, status: {_eq: ${status}}`;
        
        variables = {
            ...variables,
            status: status
        }
    }
    
    const query = `query getRewardRequests($limit: Int, $offset: Int, $order: order_by, $status: Int = 0) {
    rewards_requests(limit: $limit, offset: $offset, order_by: {created: $order}, where:{${whereQuery}}) {
        comment
        status
        id
            requestee {
                id
                lastname
                firstname
            }
            approver {
                firstname
                id
                lastname
            }reward{
                title
            }}
            rewards_requests_aggregate(where:{status:{_eq: $status}}){
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
    
    return await response.json();
}