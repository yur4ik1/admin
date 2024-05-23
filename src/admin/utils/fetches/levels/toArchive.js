import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function toArchive(id) {
    const data = JSON.stringify({
        query: `mutation LevelStatusMutation {
            update_levels_by_pk(pk_columns: {id: ${id}}, _set: {is_active: false}) {
                id
            }
        }`,
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
    
    return await response.json();
}