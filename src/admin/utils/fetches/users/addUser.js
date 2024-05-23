import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function addUser(user) {
    const query = `mutation addUser($active: Boolean,$status: Int,$email: String,$fn: String,$ln: String,$jid: Int,$mid: Int,$role: String, $tmptoken: String, $level: Int) {
        insert_users(objects: {active: $active, status: $status, email: $email, firstname: $fn, tmptoken: $tmptoken, job_id: $jid, lastname: $ln, manager_id: $mid, role: $role, level_id: $level}) {
            affected_rows
        }
    }`;
    
    const firstName = user.name.slice(0, user.name.indexOf(' '));
    const lastName = user.name.slice(user.name.indexOf(' ') + 1);

    const variables = {
        active: true,
        fn: firstName,
        ln: lastName,
        jid: user.jobId,
        mid: user.managerId,
        role: user.role,
        level: user.levelId,
        email: user.email,
        status: 1,
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