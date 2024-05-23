import { gql } from '@apollo/client';

export const GET_SENIORITY = gql`
query getSeniority {
    seniority(where: {is_active: {_eq: true}}) {
      id
      title
      slug
      color
    }
  }
`;

export const GET_DEPARTMENTS = gql`
query getDepartments($search: String) {
  departments(where: {title: {_ilike: $search}, active: {_eq: true}}) {      
    title
    title_i18n
    id
  }
}
`;

export const GET_MYSKILLS = gql`
query mySkills($uid: Int, $isSide: Boolean) {
  users_skills_levels(where: {user_id: {_eq: $uid}, isside: {_eq: $isSide}}) {
    balance
    id
    isachieved
    ismain
    since
    skills_level {
      description
      goal
      skills_levels_skill {
        id
        title
      }
      skills_levels_level {
        id
        title
      }
    }
  }
}
`;

export const GET_SKILL_MAP_REDUCED = gql`
query getSkillMapReduced {
  jobs(where: {active: {_eq: true}}) {
    description
    title
    id
    jobs_levels {
      description
      seniority_id
    }
  }
}
`;

export const GET_MYSKILLS_MAP = gql`
query mySkills($user_id: Int) {
  jobs {
    description
    title
    id
    jobs_skills_jobs {
      skills_jobs_skill {
        title
        skills_skills_levels(where: {users_skills_levels: {user_id: {_eq: $user_id}}}) {
          id
          description
          skills_levels_skill {
            id
            title
          }
          skills_levels_level {
            color
            id
            slug
            title
          }
        }
      }
    }
  }
}
`;

export const GET_SKILLS_BY_DEPARTMENTS = gql`
query skillsByDepartments($user_id: Int) {
  departments {
    title
    id
    departments_jobs {
      id
      title
      jobs_skills_jobs {
        skills_jobs_skill {
          skills_skills_levels(where: {users_skills_levels: {user_id: {_eq: $user_id}}}) {
            level_id
            skills_levels_level {
              title
            }
          }
        }
      }
    }
  }
}
`;

export const GET_SKILLS = gql`
query getSkills($search: String, $not_skills: [Int!]) {
  skills(where: {title: {_ilike: $search}, active: {_eq: true}, id: {_nin: $not_skills}}) {
    title
    id
    skills_skills_levels {
      id
      description
      skills_levels_level {
        id
        title
        color
        slug
      }
    }
  }
}
`;