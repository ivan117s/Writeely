import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

//Pages
import Home from './Components/Home';
import User from './Components/User';
import SignIn from './Components/SignIn';
import Login from './Components/Login';
import BookPage from './Components/Book';
import Write from './Components/Publish';
import Account from './Components/Acount';
import Followed from './Components/Followed'
import Edit from './Components/Editbook';
import Library from './Components/Library';

//Redux
import { connect } from 'react-redux';
import { getUser } from './redux/reducers';
import { updateUser } from './redux/actions';
import MyBooks from './Components/MyBooks';
import Explore from './Components/Explore';


const App = () =>
{
   return(
   <Router>
        <Switch>
            <Route path="/" component={Home} exact/>
            <Route path="/my-books" component={MyBooks}/>
            <Route path="/library" component={Library} exact/>
            <Route path="/account" component={Account} exact/>
            <Route path="/login" component={Login} exact/>
            <Route path="/editbook/:bookId" component={Edit} exact/>
            <Route path="/signin" component={SignIn} exact/>
            <Route path="/publish" component={Write} exact/>
            <Route path="/user/:name" component={(props) => <User {...props} key={props.match.params.name}/>} />
            <Route path="/followed" component={Followed} exact />
            <Route path="/book/:bookId" component={BookPage} />
            <Route path="/explore" component={Explore} exact/>
            <Route path="*" component={Home} />
        </Switch>
   </Router>)  
}

export default connect(getUser, {updateUser})(App);



