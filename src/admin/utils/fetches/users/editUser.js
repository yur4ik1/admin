import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function editUser(user) {
    const query = `mutation editUser($status: Int,$id: Int,$fn: String,$ln: String,$jid: Int,$mid: Int,$role: String,$active: Boolean, $level: Int) {
    update_users(where: {id: {_eq: $id},active:{_eq:$active}}, _set: {status: $status, firstname: $fn, job_id: $jid, lastname: $ln, manager_id: $mid, role: $role, level_id: $level}) {
            affected_rows
        }
    }`;
    
    const firstName = user.name.slice(0, user.name.indexOf(' '));
    const lastName = user.name.slice(user.name.indexOf(' ') + 1);

    const variables = {
        id: user.id,
        active: true,
        fn: firstName,
        ln: lastName,
        jid: user.jobId,
        mid: user.managerId,
        role: user.role,
        level: user.levelId,
        status: user.status === 'Active' ? 1 : 0,
        tmptoken: user.password
    }

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