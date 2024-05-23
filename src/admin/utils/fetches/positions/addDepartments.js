import { BaseUrl } from "../../constants.js";
import { getToken } from "../../getToken.js";
export const addDepartment = async (departments) => {
    if (!departments || departments.length === 0) {
        return null;
    }

    const data = JSON.stringify({
        query: `mutation InsertDepartmentsMutation($departments: [departments_insert_input!]!) {
            insert_departments(objects: $departments) {
                returning {
                    id
                    title
                }
            }
        }`,
        variables: {
            departments: departments.map(({ id, ...rest }) => rest)
        }
    });

    try {
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
        const json = await response.json();
        return json.data.insert_departments;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};
