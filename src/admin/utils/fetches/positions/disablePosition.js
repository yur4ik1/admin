import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function disablePosition(id, status) {
    console.log("query placed!")
    const query = `mutation DisableDepartment($id: Int!, $active: Boolean) {
                          update_departments(where: { id: { _eq: $id } }, _set: { active: $active }) {
                            affected_rows
                            }
                          }`;

    const variables = {
        id: id,
        active: status
    }

    const response = await fetch(BaseUrl, {
        method: 'POST', headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken()
        }, body: JSON.stringify({
            query, variables
        })
    });

    return await response.json();
}

