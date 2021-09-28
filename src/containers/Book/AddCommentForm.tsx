import React, { FC, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation } from '@apollo/client'
import ErrorComponent from 'components/Error'
import { ADD_COMMENT_MUTATION } from './graphql'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    '& .MuiInputBase-multiline': {
      width: '50ch',
    },
  },
}))

const AddCommentForm: FC<{
  open: boolean
  handleClose: () => void
  onSuccess: () => void
  bookId: string
}> = ({ open, handleClose, onSuccess, bookId }) => {
  const classes = useStyles()
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')

  const [addComment, { data, error, loading }] = useMutation(ADD_COMMENT_MUTATION)
  const addCommentCallback = useCallback(() => {
    addComment({
      variables: {
        comment: {
          bookId,
          author,   
          text
        },
      },
    })
  }, [author, text, bookId, addComment])
  
  useEffect(() => {
    if (data) {
      onSuccess()
      handleClose()
    }
  })
  if (loading) return <CircularProgress />
  if (error) return <ErrorComponent error={error} />

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      className={classes.root}
    >
      <DialogTitle>Add Comment</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={author}
          onChange={event => setAuthor(event.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={text}
          onChange={event => {
            setText(event.target.value);
          }}
        />
   
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={addCommentCallback} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCommentForm
