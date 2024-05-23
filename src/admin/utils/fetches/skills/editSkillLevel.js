import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editSkillLevel (json) {
    const query = `mutation updateSkillLevel($active: Boolean, $id: Int, $description: String, $goal: Int, $level_id: Int, $status: Int) {
    update_skills_levels(where: {id: {_eq: $id}}, _set: {description: $description, goal: $goal, level_id: $level_id, active: $active, status: $status}) {
        returning {
        active
        status
        description
        goal
        id
        level_id
        }
        affected_rows
    }
    }`;
    
    let variables = {
        id: json.id,
        active: json.status === "Active",
        status: json.status === "Active" ? 1 : 0,
        description: json.description,
        goal: json.recipientCondition,
        level_id: json.levelId
    }
    
    const response = await fetch(
        BaseUrl,
        {
            method: 'post',
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(
                {
                    query: query,
                    variables: variables
                }
            )
        }
    );
    
    return await response.json();
}