import { gql } from '@apollo/client';

export const GET_SKILLS = gql`
query getSkills($search: String) {
    skills(where: {active: {_eq: true}, title: {_ilike: $search}}) {
      id
      title
      title_i18n
    }
}
`;

export const GET_TASKS = gql`
query getTasks($limit: Int, $offset: Int, $user_id: Int, $_status: [Int!] = [1, 2], $sort: order_by = desc, $_priority: [Int!] = [1, 2, 3, 4, 5]) {
    tasks(where: {assignee_id: {_eq: $user_id},status: {_lte: 3, _in: $_status}, priority: {_in: $_priority}}, limit: $limit, offset: $offset, order_by: {bounty: $sort}) {
      bounty
      priority
      assignee_id
      id
      title
      text
      status
    }
    tasks_aggregate(where: {assignee_id: {_eq: $user_id}, status: {_lte: 3, _in: $_status}, priority: {_in: $_priority}}) {
      aggregate {
        count
      }
    }
  }
`;

export const ADD_TASK = gql`
mutation insertTask($user_id: Int, $bounty: Int, $priority: Int, $title: String, $text: String) {
  insert_tasks(objects: {assignee_id: $user_id, bounty: $bounty, priority: $priority, title: $title, text: $text}) {
    affected_rows
  }
}
`;