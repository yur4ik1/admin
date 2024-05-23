import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getPositions(limit, offset, search = '', status='') {

    let builtQuery = ``;

    if (search || status) {
        if (search && search !== '') {
            builtQuery += `title: {_ilike: "${search + '%'}"}`;
        }
        if (status && status !== '') {
            if (search && search !== '') builtQuery += `, `;

            let statusQuery = status ? 1 : 0;

            builtQuery += `status: {_eq: ${statusQuery}}`;
        }
    }

    // added jobs_levels in query

    const data = JSON.stringify({
        query: `query DepartmentsQuery($limit: Int, $offset: Int) {
            departments(limit: $limit, offset: $offset, where: {${builtQuery}}, order_by: {id: desc}) {
                id
                title
                active
                departments_jobs {
                active
                description
                title
                 id
                 
                jobs_levels(order_by: {seniority_id: asc}) {
                  description
                  id
                  job_id
                  seniority {
                    color
                    id
                    is_active
                    title
                  }
                  seniority_id
                  title
                }
                
                jobs_skills_jobs(where: {}) {
                    skills_jobs_skill {
                    title
                    status
                    id
                    }
                }
                }
            },
            departments_aggregate(where: {active: {_eq: true}}) {
                aggregate {
                count
                }
            }
        }`,

        variables: {
            limit: limit,
            offset: offset
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