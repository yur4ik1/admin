import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function performSearch(search, status) {
let whereQuery = '';
    
    if (status !== undefined) {
        whereQuery = `active: {_eq: ${status}}`;
    }
    
    const data = JSON.stringify({
        query: `query SkillsQuery($search: String) {
            skills(where: {title: {_ilike: $search}, ${whereQuery}}) {
                title
                id
            }
        }`,
        variables: {
            search: `${search}%`
        }
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