import { gql } from '@apollo/client';

export let GET_PROFILE = gql`query getProfile($ssoid:String) {
    users(where: {ssoid: {_eq: $ssoid}}) {
        active
        email
        firstname
        id
        job_id
        lastname
        level_id
        manager_id
        role
        status
        users_job {
            department_id
            id
            title
        }users_level {
            id
            title
            slug
        }users_manager {
            id
            lastname
            firstname
        }
    }
}`;