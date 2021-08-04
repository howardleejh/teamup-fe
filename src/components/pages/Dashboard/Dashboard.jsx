import React from 'react'
import clsx from 'clsx'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Budgetplanning from './Budgetplanning'
import Dday from './Dday'
import Guestlists from './Guestlists'
import UpcomingEvents from './UpcomingEvents'
import Todo from './Todo'
import NavBar from '../Navbar/NavBar'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import { withCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import Pagination from '@material-ui/lab/Pagination'
import _ from 'lodash'

const styles = (theme) => ({
  root: {
    display: 'flex',
    background: '#F9F8FF',
  },

  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    textAlign: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
})

// export default function Dashboard() {
class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    const { cookies } = props

    this.state = {
      user: cookies.get('auth_token'),
      daysLeft: '',
      budget: '',
      currentBudget: '',
      attending: '',
      notAttending: '',
      pending: '',
      total: '',
      allEventData: [],
      currentPage: 0,
    }
  }

  async componentDidMount() {
    let dashboardURL = 'https://teamup-be.herokuapp.com/api/v1/users/dashboard'
    let eventURL = 'https://teamup-be.herokuapp.com/api/v1/users/events/'

    const promise1 = await axios.get(dashboardURL, {
      headers: { auth_token: this.state.user },
    })
    const promise2 = await axios.get(eventURL, {
      headers: { auth_token: this.state.user },
    })

    Promise.all([promise1, promise2])
      .then((response) => {
        this.setState({
          userMessage: response[0].data.message,
          daysLeft: response[0].data.calendar.daysLeft,
          budget: response[0].data.budget.initialBudget,
          currentBudget: response[0].data.budget.currentBudget,
          attending: response[0].data.guests.totalAttending || 0,
          notAttending: response[0].data.guests.totalUnavailable || 0,
          pending: response[0].data.guests.totalPending || 0,
          total: response[0].data.guests.totalGuests || 0,
          totalTasks: response[0].data.todos.total || 0,
          completedTasks: response[0].data.todos.completed || 0,
          numberOfEvents: response[0].data.events.total || 0,
          allEventData: _.chunk(response[1].data, 4),
        })
      })
      .catch((err) => {
        return err
      })
  }

  render() {
    if (!this.state.user) {
      return <Redirect to='/login' />
    }

    if (this.state.daysLeft === 0 || this.state.budget === 0) {
      return <Redirect to='/date-and-budget' />
    }

    const { classes } = this.props

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    // To handle page change to show array of items
    const handlePageChange = (e) => {
      this.setState({
        currentPage: e.target.innerText - 1,
      })
    }

    return (
      <div className={classes.root}>
        <NavBar title='Dashboard' message={`test`} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth='lg' className={classes.container}>
            <Grid container spacing={3}>
              {/* D-day */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Dday dDay={this.state.daysLeft} />
                </Paper>
              </Grid>

              {/* Budget-Planning */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                  <Budgetplanning
                    budget={`$${parseFloat(this.state.budget).toFixed(2)}`}
                    currentBudget={`$${parseFloat(
                      this.state.currentBudget
                    ).toFixed(2)}`}
                  />
                </Paper>
              </Grid>

              {/* Guestlists */}
              <Grid item xs={12} md={6} lg={6}>
                <Paper className={fixedHeightPaper}>
                  <Guestlists
                    attending={this.state.attending}
                    notAttending={this.state.notAttending}
                    pending={this.state.pending}
                    total={this.state.total}
                  />
                </Paper>
              </Grid>

              {/* To Dos  */}
              <Grid item xs={12} md={6} lg={6}>
                <Paper className={fixedHeightPaper}>
                  <Todo
                    totalTasks={this.state.totalTasks}
                    completed={this.state.completedTasks}
                  />
                </Paper>
              </Grid>
              <Grid container spacing={2}>
                {this.state.allEventData % 4 === 0 ? (
                  <h6>There are no items at the moment.</h6>
                ) : (
                  this.state.allEventData[this.state.currentPage].map(
                    (item, pos) => {
                      return (
                        <Grid key={pos} item xs={3}>
                          <Paper className={classes.paper}>
                            <UpcomingEvents
                              eventName={item.event_name}
                              eventDate={item.from}
                              key={pos}
                            />
                          </Paper>
                        </Grid>
                      )
                    }
                  )
                )}

                <Grid item xs={12}>
                  <Pagination
                    count={Math.ceil(this.state.numberOfEvents / 4)}
                    color='primary'
                    onChange={(e) => {
                      handlePageChange(e)
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
    )
  }
}

export default withCookies(withStyles(styles)(Dashboard))
