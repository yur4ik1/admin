import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function updateTitle(id, title) {
    let variables = {
        id: id,
        title: title
    }
    
    const query = `mutation updateSkill($title: String, $id: Int) {
        update_skills(where: {id: {_eq: $id}}, _set: {title: $title}) {
            returning {
                id
                title
            }
            affected_rows
        }
    }`;
    
    const response = await fetch(BaseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    });
    
    return response.json();
}