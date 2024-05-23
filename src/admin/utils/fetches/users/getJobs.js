import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getJobs(departmentId) {
    let variables = {
        departmentId
    }
    
    const query = `query getJobs($departmentId: Int) {
        jobs(where:{department_id:{_eq:$departmentId}})  {
            id
            title
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