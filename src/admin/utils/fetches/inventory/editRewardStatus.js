import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export const editRewardStatus = async (rewardId, status) => {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
            query: `mutation editReward($id: Int, $active: Boolean) {
            update_rewards(where: {id: {_eq: $id}}, _set: {active: $active}) {
                returning {
                active
                id
                }
            }
            }`,
            variables: {
                "id": rewardId,
                "active": status,
            }
        })
    }
    
    const response = await fetch(BaseUrl, request);
    return await response.json();
}