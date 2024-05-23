import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getManagers(search) {
    let variables = {}
    
    let whereSearch = '';
    
    if (search !== '') {
        // whereSearch = `, firstname: {_ilike: "%${search}%"},`;
        whereSearch = `, firstname: {_ilike: "${search.charAt(0)}%"}`;
    }
    
    const query = `query getManager {
        users(where:{active:{_eq:true} ${whereSearch}})  {
            firstname
            lastname
            id
            active
        }
    }`;
    
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