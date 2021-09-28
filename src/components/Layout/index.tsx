import React, { FC } from 'react'
import { remove } from 'js-cookie'
import { withStyles } from '@material-ui/core/styles'
import {
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemText,
  Button,
} from '@material-ui/core'
import { Link } from 'react-router-dom'

import { BasicStyledComponent } from '../../types'

import { styles } from './styles'

const contentDriver = [
  {
    name: 'Authors',
    link: '/',
  },
  {
    name: 'Books',
    link: '/books',
  },
]

const AppContainer: FC<BasicStyledComponent> = ({ children, classes }) => (
  <div className={classes.root}>
    <CssBaseline />
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          <Link to="/" className={classes.link}>
            React Advanced | GraphQL
          </Link>
        </Typography>
        <Button
          color="inherit"
          onClick={() => {
            remove('token')
            window.location.reload()
          }}
        >
          Sing Out
        </Button>
      </Toolbar>
    </AppBar>
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {contentDriver.map(item => (
          <Link to={item.link} key={item.link} className={classes.link}>
            <ListItem button>
              <ListItemText primary={item.name} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
    <main className={classes.content}>
      <div className={classes.toolbar} />
      {children}
    </main>
  </div>
)

export default withStyles(styles)(AppContainer)
