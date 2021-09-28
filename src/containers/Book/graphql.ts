import { gql } from '@apollo/client'

export const GET_BOOK_BY_ID = gql`
  query getBook($id: ID!) {
    getBook(id: $id) {
      id
      description
      title
      pubDate
      author {
        id
        lastname
        firstname
      }
      comments {
        author
        text
      }
    }
  }
`

export const ADD_COMMENT_MUTATION = gql`
  mutation addNewComment($comment: NewComment!) {
    addComment(comment: $comment) {
      id
    }
  }
`

export const COMMENT_ADDED = gql`
  subscription onCommentAdded {
    commentAdded {
      author
      text
    }
  }
`
