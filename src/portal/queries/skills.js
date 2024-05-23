import { gql } from '@apollo/client';

export const GET_MYSKILLS = gql`
query MySkills($uid: Int, $lang: String) {
    users_skills_levels(where: {user_id: {_eq: $uid}}) {
      balance
      id
      ismain
      status
      skills_level {
        attribute {
          id
          slug
          picture_active
          picture_scope
          picture_passive
        }
        skills_levels_level {
          id
          title
          i18n_levels(where: {lang: {_eq: $lang}}) {
            color
            title
          }
          color
        }
        id
        goal
        description
        skill_id
        skills_levels_skill {
          id
          title
          i18n_skills(where: {lang: {_eq: $lang}}) {
            title
            lang
          }
        }
      }
    }
  }
`;

export const DEACTIVATE_SKILL = gql`
mutation deactivateSkill($usl_id: Int) {
  update_users_skills_levels(where: {id: {_eq: $usl_id}}, _set: {ismain: false}) {
    affected_rows
  }
}
`;

export const ACTIVATE_SKILL = gql`
mutation deactivateSkill($usl_id: Int) {
  update_users_skills_levels(where: {id: {_eq: $usl_id}}, _set: {ismain: true}) {
    affected_rows
  }
}
`;

export const FILTER_POTENTIAL_SKILLS = gql`
query filterPotentialSkills($user_id: Int, $search: String, $_eq: String = "") {
  users_skills_levels(where: {_and: {user_id: {_eq: $user_id}, _and: {isachieved: {_eq: false}, ismain: {_eq: false}, skills_level: {skills_levels_skill: {title: {_ilike: $search}}}}}}) {
    balance
    id
    isachieved
    ismain
    isside
    since
    skills_level {
      goal
      description
      skills_levels_skill {
        title
        id
      }
      level_id
      skills_levels_level {
        slug
      }
    }
  }
}
`;

export const ADD_POTENTIAL_SKILL = gql`
mutation activateMySkill($usl_id: Int) {
  update_users_skills_levels(where: {id: {_eq: $usl_id}}, _set: {ismain: true, isside: false}) {
    affected_rows
  }
}
`;