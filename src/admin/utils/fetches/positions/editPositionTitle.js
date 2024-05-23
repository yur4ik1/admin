import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editPositionTitle(id, title) {
    const query = `
        mutation updateDept($id: Int, $title:String) {
        update_departments(where: {id: {_eq: $id}}, _set: {title: $title}) {
            affected_rows
        }
    }`;
    
    const variables = {
        id: id,
        title: title
    }
    
    const response = await fetch(BaseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
    
    return await response.json();
}