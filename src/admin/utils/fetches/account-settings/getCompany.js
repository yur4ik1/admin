import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getCompany() {
    const data = JSON.stringify({
        query: `query getCompany {
              company(where: {slug: {_eq: "main"}}) {
                address1
                address2
                city
                company_owner {
                  id
                  firstname
                  lastname
                }
                country
                cstate
                id
                name
                slug
                url
                zip
              }
            }`
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
        });
    
    return response.json();
}