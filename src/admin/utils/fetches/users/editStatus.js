import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export const editStatus = async (id, status) => {
    const query = `mutation editUser( $active: Boolean, $id: Int, $status: Int) {
    update_users(where: {id: {_eq: $id}}, _set: {active: $active, status: $status}) {
        affected_rows
    }}`;
    
    let variables = {
        active: status === 1,
        status: status,
        id: id
    }
    
    const data = JSON.stringify({query, variables});
    
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