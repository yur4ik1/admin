import {BaseUrl} from "../../constants.js";
import {getToken} from "../../getToken.js";

export async function pushLevels(data) {
    const requestOptionsSave = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
            query: `
                    mutation LevelsMutation($l1: Boolean, $l2: Boolean, $l3: Boolean, $l4: Boolean, $l5: Boolean, $l6: Boolean) {
                    update_levels_many (
                        updates: [
                        {
                            where: {id: {_eq: 1}},
                            _set: {is_active: $l1}
                        },
                        {
                            where: {id: {_eq: 2}},
                            _set: {is_active: $l2}
                        },
                        {
                            where: {id: {_eq: 3}},
                            _set: {is_active: $l3}
                        },
                        {
                            where: {id: {_eq: 4}},
                            _set: {is_active: $l4}
                        },
                        {
                            where: {id: {_eq: 5}},
                            _set: {is_active: $l5}
                        },
                        {
                            where: {id: {_eq: 6}},
                            _set: {is_active: $l6}
                        },
                        ]
                    ) {
                        affected_rows
                    }
                    }`,
            
            variables: {
                "l1": data[0].is_active,
                "l2": data[1].is_active,
                "l3": data[2].is_active,
                "l4": data[3].is_active,
                "l5": data[4].is_active,
                "l6": data[5].is_active,
            }
        })
    }
    
    const response = await fetch(BaseUrl, requestOptionsSave);
    
    return await response.json();
}