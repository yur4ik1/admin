import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function addBadge(badge) {
    const query = `mutation insertBadge ($active: Boolean,$camount: Int, $cbamount: Int, $cperiod: String, $creward: Int, $ctype: String, $title: String) {
         insert_badges(objects: {active: $active, camount: $camount, cbamount: $cbamount, cperiod: $cperiod, creward: $creward, ctype: $ctype, title: $title}) {
            returning {
            active
            camount
            cbamount
            cperiod
            creward
            ctype
            title
            }
        }
    }`;
    
    const variables = {
        active: badge.status === "Active",
        camount: badge.amount,
        cbamount: badge.badges,
        cperiod: badge.period,
        creward: badge.reward,
        ctype: badge.type,
        title: badge.name
    }
    
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