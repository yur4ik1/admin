import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getSkills(limit, offset, status, search) {
    let whereQuery = '';
    
    if (status !== undefined) {
        whereQuery = `active: {_eq: ${status}}`;
    }
    
    if (search !== undefined && search !== '') {
        if (status !== undefined) {
            whereQuery += ', ';
        }
        
        whereQuery += `title: {_ilike: "${search}%"}`;
    }
    
    const data = JSON.stringify({
        query: `query SkillsQuery($limit: Int, $offset: Int = 0) {
        skills(limit: $limit, offset: $offset, order_by:{id:asc}, where: {${whereQuery}}) {
        active
        status
        title
        id
        skills_skills_levels(order_by:{id:asc}) {
        active
        id
        description
        goal
        status
        skill_id
        level_id
        skills_levels_level {
        title
        }
        }
        skills_skills_departments {
        skills_departments_department {
        id
        title
        }
        }
        }
        }`,
        variables: {
            limit: limit,
            offset: offset,
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