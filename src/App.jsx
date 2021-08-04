import React from 'react'
import './App.css'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'
import { CookiesProvider } from 'react-cookie'
import { ToastContainer } from 'material-react-toastify'
import 'material-react-toastify/dist/ReactToastify.css'

// PAGES //
import Dashboard from './components/pages/Dashboard/Dashboard'
import SignInSide from './components/pages/User/SignInSide'
import RegisterPage from './components/pages/User/RegisterPage'
import RegisterChangePassword from './components/pages/User/RegisterChangePassword'
import RegisterDateBudget from './components/pages/User/RegisterDateBudget'
import LoginGuest from './components/pages/User/LoginGuest'
import GuestRSVP from './components/pages/User/GuestRSVP'
import BudgetEdit from './components/pages/Budget/Budget-Edit'
import ToDoMain from './components/pages/To-Do/Todo-Main'
import ToDoEdit from './components/pages/To-Do/Todo-Edit'
import GuestlistCreate from './components/pages/Guestlist/Guestlist-Form'
import GuestListMain from './components/pages/Guestlist/Guestlist-Main'
import EventEdit from './components/pages/Event-Schedule/Event-Edit'
import BudgetMain from './components/pages/Budget/Budget-Main'
import EventMain from './components/pages/Event-Schedule/Event-Main'
import UpdateUser from './components/pages/User/UpdateUser'
import LandingPage from './components/pages/Landing-Page/LandingPage'

const theme = createTheme({
  typography: {
    fontFamily: ['Lexend', 'sans-serif'].join(','),
    h1: {
      fontWeight: 700,
    },
  },
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#7865E5',
    },
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
  },
})

class App extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  }
  render() {
    return (
      <CookiesProvider>
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
        />
        <ThemeProvider theme={theme}>
          <Router>
            <div className='App'>
              <Switch>
                {/* Users Routes*/}
                <Route path='/login' component={SignInSide} />
                <Route
                  path='/register/change-password/:activationId'
                  component={RegisterChangePassword}
                />
                <Route path='/date-and-budget' component={RegisterDateBudget} />

                <Route path='/register' component={RegisterPage} />

                <Route path='/guest/login' component={LoginGuest} />
                <Route path='/guest/RSVP' component={GuestRSVP} />
                <Route path='/updates' component={UpdateUser} />

                {/* Dashboard Route*/}
                <Route path='/dashboard' component={Dashboard} />

                {/* Budget Routes*/}
                <Route path='/budget/create' component={BudgetEdit} />
                <Route path='/budget/edit' component={BudgetEdit} />
                <Route path='/budget' component={BudgetMain} />

                {/* To Do List Routes*/}
                <Route path='/to-do/create' component={ToDoEdit} />
                <Route path='/to-do/edit' component={ToDoEdit} />
                <Route path='/to-do' component={ToDoMain} />

                {/* Guest List Routes*/}
                <Route path='/guest-lists/create' component={GuestlistCreate} />
                <Route path='/guest-lists/edit' component={GuestlistCreate} />
                <Route path='/guest-lists' component={GuestListMain} />

                {/* Events Routes*/}
                <Route path='/events/create' component={EventEdit} />
                <Route path='/events/edit' component={EventEdit} />
                <Route path='/events' component={EventMain} />

                {/* Landing Page*/}
                <Route path='/' component={LandingPage} />
              </Switch>
            </div>
          </Router>
        </ThemeProvider>
      </CookiesProvider>
    )
  }
}

export default withCookies(App)
