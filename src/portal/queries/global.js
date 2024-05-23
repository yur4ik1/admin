import { gql } from '@apollo/client';

export const GET_BALANCE = gql`
query getBalance($user_id: Int) {
    balance(where: {user_id: {_eq: $user_id}}) {
      coins
      crystals
      user_id
    }
}`

export const GET_MESSAGES = gql`
query getMessages($user_id: Int) {
  messages(where: {user_id: {_eq: $user_id}, isactive: {_eq: true}}) {
    id
    text
  }
  messages_aggregate(where: {user_id: {_eq: $user_id}, isactive: {_eq: true}}) {
    aggregate {
      count
    }
  }
}
`

export const MARK_MESSAGES_AS_READ = gql`
mutation markMessagesAsRead($user_id: Int) {
  update_messages(where: {user_id: {_eq: $user_id}}, _set: {isactive: false}) {
    affected_rows
  }
}
`

export const GET_LEVELS = gql`
query getLevels {
  levels(order_by: {id: asc}, where: {is_active: {_eq: true}}) {
    color
    id
    seniority_id
    slug
    title
  }
  }
`