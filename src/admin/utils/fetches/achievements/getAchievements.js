import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getAchievements(limit, offset, order, status, search) {
    let buildWhereQuery = "";
    
    if (status !== undefined) {
        buildWhereQuery = `active: {_eq: ${status}}`;
    }
    
    if (search !== undefined) {
        if (status !== undefined) {
            buildWhereQuery += `, `;
        }
        
        buildWhereQuery += `title: {_ilike: "${search}%"}`;
    }
    
    const query = `query getBadges($limit: Int, $offset: Int, $order: order_by) {
    badges(limit: $limit, offset: $offset, order_by: {id: $order}, where: {${buildWhereQuery}}) {
        active
        camount
        cbamount
        cperiod
        creward
        ctype
        id
        title
            },badges_aggregate(where: {${buildWhereQuery}}){
                aggregate{
                    count
            }
        }
    }`;
    
    const variables = {
        limit: limit,
        offset: offset,
        order: order
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