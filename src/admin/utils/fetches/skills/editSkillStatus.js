import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editSkillStatus(id, currentStatus) {
    const query = `mutation updateSkill($active: Boolean, $id: Int) {
    update_skills(where: {id: {_eq: $id}}, _set: {active: $active}) {
        returning {
        active
        id
        title
        }
        affected_rows
    }
    } `;
    
    let variables = {
        id: id,
        active: !currentStatus
    }
    
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
    
    return await response.json();
}