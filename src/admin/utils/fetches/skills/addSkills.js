import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function addSkill(json) {

    let variables = {
        title: json.title,
        status: json.status === 'Active' ? 1 : 0
    }
    console.log(variables)
    
    const query = `mutation AddSkillMutation($status: Int, $title: String) {
      insert_skills(objects: {status: $status, title: $title}) {
      returning {
          id
        }
      }
    }`;
    
    const data = JSON.stringify({
        query: query,
        variables: variables
    });
    
    const response = await fetch(
        BaseUrl,
        {
            method: 'post',
            
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + getToken()
            },
            body: data
        }
    );
    
    const responseData = await response.json();
    
    const id = responseData.data.insert_skills.returning[0].id;
    
    if (json.departmentId) {
        const dataSkillDepartment = `mutation SkillsDepartmentsMutation($department_id: Int, $skill_id: Int) {
          insert_skills_departments(objects: [{department_id: $department_id, skill_id: $skill_id}]) {
            returning {
              department_id
              skill_id
            }
          }
        }`;
        
        const variablesSkillDepartment = {
            department_id: json.departmentId,
            skill_id: id
        };
        
        const responseSkillDepartment = await fetch(
            BaseUrl,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': dataSkillDepartment.length,
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({
                    query: dataSkillDepartment,
                    variables: variablesSkillDepartment
                })
            }
        );
        
        return await responseSkillDepartment.json();
    }
}