import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editBadgeStatus(id, status) {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
            query: `mutation updateBadge($id: Int = 1, $active: Boolean = false) {
                update_badges(where: {id: {_eq: $id}}, _set: {active: $active}) {
                    returning {
                    active
                    id
                    }
                }
            }`,
            variables: {
                "id": id,
                "active": status,
            }
        })
    };
    
    const response = await fetch(BaseUrl, request);
    return await response.json();
}