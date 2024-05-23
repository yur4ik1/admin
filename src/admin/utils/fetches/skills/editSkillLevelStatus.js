import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editSkillLevelStatus(skillLevelId, status) {
    const query = `mutation updateSkillLevel($active: Boolean, $id: Int,$status: Int) {
     update_skills_levels(where: {id: {_eq: $id}}, _set: {active: $active, status: $status}) {
     returning {
         id
         active
        status
         }
         affected_rows
        }
    }`;
    
    const variables = {
        id: skillLevelId,
        active: status !== 'Active',
        status: status !== 'Active' ? 1 : 0
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