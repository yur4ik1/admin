import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function addSkillLevel(id, json) {
    const query = `mutation insertSkillLevel($description: String, $goal: Int, $level_id: Int, $skill_id: Int, $status: Int ) {
      insert_skills_levels(objects: {description: $description, goal: $goal, level_id: $level_id, skill_id: $skill_id, status: $status}) {
        returning {
          id
        }
      }
    }`;
    
    let variables = {
        description: json.description,
        goal: json.recipientCondition,
        level_id: json.levelId,
        skill_id: id,
        status: json.status === 'Active' ? 1 : 0
    }
    
    const response = await fetch(BaseUrl, {
        method: 'post',
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