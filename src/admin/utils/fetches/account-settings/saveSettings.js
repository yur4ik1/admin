import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function saveSettings(data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
            query: `mutation CompanyMutation($address1: String, $address2: String, $city: String, $country: String, $cstate: String, $name: String, $url: String, $zip: String) {
            update_company(where: {slug: {_eq: "main"}}, _set: {address1: $address1, address2: $address2, city: $city, country: $country, cstate: $cstate, name: $name, url: $url, zip: $zip}) {
              returning {
                address1
                address2
                city
                country
                cstate
                id
                name
                url
                zip
                }
               }
              }`,
            
            variables:
                {
                    "address1": data.address1,
                    "address2": data.address2,
                    "city": data.city,
                    "country": data.country,
                    "cstate": data.cstate,
                    "name": data.name,
                    "url": data.url,
                    "zip": data.zip,
                }
        })
    }
    const response = await fetch(BaseUrl, requestOptions);
    return await response.json();
}