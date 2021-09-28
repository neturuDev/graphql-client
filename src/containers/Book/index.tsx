import React, { useState, FC } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { Card, CardContent } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { isNil } from 'lodash'

import { BookCardComponent } from '../../components'

import { GET_BOOK_BY_ID, COMMENT_ADDED } from './graphql'

import styles from './styles'
import { getBook } from './__generated__/getBook'
import { BasicStyledComponent } from '../../types'

import AddCommentForm from './AddCommentForm';


const NewComment: FC<{ onNewComment: () => void }> = ({ onNewComment }) => {
  const { data } = useSubscription<any>(COMMENT_ADDED, {
    onSubscriptionData: () => {
      onNewComment()
    },
  })

  if (!data) return null

  return (
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        New comment added: {data.commentAdded.author} {data.commentAdded.text}
      </CardContent>
    </Card>
  )
}


const BookComponent = ({
  bookId,
  classes,
}: { bookId: number } & BasicStyledComponent) => {
  const [commentPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)
  const { data, error, refetch } = useQuery<getBook>(GET_BOOK_BY_ID, {
    variables: { id: bookId },
  })
  const [commentModalOpen, setCommentModalOpen] = useState(false);



  if (error) return <p>Error!: ${error}</p>
  if (isNil(data?.getBook)) return <p>Loading...</p>
  const setNextPage = () => {
    const comments = data?.getBook?.comments ?? []
    if (comments?.length && pageNumber + commentPerPage <= comments?.length)
      setPageNumber(pageNumber + commentPerPage)
  }
  const setPreviousPage = () => {
    if (pageNumber - commentPerPage > 0) setPageNumber(pageNumber - commentPerPage)
  }
  if (!data?.getBook) return <p>No such Book!</p>

  const book = data.getBook

  const handleModalOpen = () => {
    setCommentModalOpen(true);
  }
  const handleModalClose = () => {
    setCommentModalOpen(false)
  }

  return (<>
    <NewComment onNewComment={refetch} />
    <Paper className={classes.root}>
      <div className={classes.container}>
        <BookCardComponent
          classes={classes}
          title={book.title}
          description={book.description}
          author={book.author}
          date={book.pubDate}
        />
        {book?.comments?.length !== 0 && (
          <Paper className={classes.comments}>
            <div className={classes.title}>Comments</div>
            <Button variant="outlined" color="primary" onClick={handleModalOpen}>
              ADD COMMENT
            </Button>
            <div className={classes.pagination}>
              <Button onClick={setPreviousPage}>Prev</Button>
              <Button onClick={setNextPage}>Next</Button>
            </div>
            {book.comments?.map((comment) => {
              return(
                <div className={classes.comment}>
                  <p>{comment?.author}</p>
                  <p>{comment?.text}</p>
                </div>
              )
            })}

          </Paper>
        )}
      </div>
      <Button
        variant="contained"
        className={classes.button}
        component={Link}
        to="/books"
        color="secondary"
      >
        Back
      </Button>
    </Paper>
    <AddCommentForm open={commentModalOpen} handleClose={handleModalClose} onSuccess={refetch} bookId={book.id} />
  </>)
}

export default withStyles(styles)(BookComponent)
