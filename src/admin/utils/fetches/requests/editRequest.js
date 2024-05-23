import {getToken} from "../../getToken.js";
import {BaseUrl} from "../../constants.js";

export async function editRequest(id, status, comment) {
    const query = `mutation editRewardRequest($id: Int, $approver_id: Int, $comment:String,$status: Int,) {
        update_rewards_requests(where: {id: {_eq: $id}}, _set: {approver_id: $approver_id, comment: $comment, status: $status}) {
            affected_rows
        }
    }`;
    
    const variables = {
        id: id,
        status: status,
        comment: comment,
        approver_id: 13
    };
    
    const data = JSON.stringify({ query, variables });
    
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