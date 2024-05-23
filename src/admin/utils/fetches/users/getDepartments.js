import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getDepartments(search) {
    let variables = {}
    
    let whereQuery = '';
    
    if (search) {
        whereQuery = `, title: {_ilike: "%${search}%"}`;
    }
    
    const query = `query readDepartments {
         departments(where: {active: {_eq: true} ${whereQuery}}) {
           title
            id
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