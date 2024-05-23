import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function getBillingData() {
    let query = `query getBillingData {
  users_aggregate(where: {active: {_eq: true}}) {
    aggregate {
      count
    }
  }
  company {
    paddle_customer_id
  }
}`
    let variables = {
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

    // console.log(await response.json())
    
    return response.json();

}