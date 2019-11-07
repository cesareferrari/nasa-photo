# Redux 2



Video

https://youtu.be/Xop-v18NITk?t=1175



## State machine


A state machine is a system that has a specific state and changes its state
from one specific state into another specific state based on the variables introduced into the system.

Example: traffic lights

initial state is stop (red)
there is an input (maybe a timer) that makes it go to state: go and changes the
light to green
Then from go to slow down => Yellow
Then from yellow to red again.


One or more different states and variables that change the transitions between
the states.

Example of a finite state machine:

States          Input            Transition to other state
----------      -------------    --------------
LOG IN FORM     submit           LOADING

LOADING         success  ->      PROFILE
                failure  ->      ERROR

PROFILE         profile  ->      PROFILE
                log out  ->      LOG IN FORM

ERROR           try again ->     LOADING



Redux is the holder of the application level state, so we keep our state inside
Redux and the action creators are the things that initiate the transition and
the reducers take the broader state and updates the existing state machine,
based on the actions.

So, you can look at Redux as a finite state machine with state that changes
based on actions.


## Redux middleware

Redux middleware allows us to insert something between 
action creator and dispatching of the action so we can do 
extra operation in between.
For example we can do an api call and have the action creator dispatch different
actions depending on the result of the api call.

The method we pull in from Redux to apply middleware is applyMiddleware
We import it in index.js along with the Provider and the reducer which is called
rootReducer. 

```
// index.js

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware);

ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root')
);
```

## Thunk

Install redux-thunk:

```
npm i redux-thunk
```


Import thunk:

```
// index.js
import thunk from 'redux-thunk';
```

Add thunk to applyMiddleware:

```
const store = createStore(rootReducer, applyMiddleware(thunk));
```

This will send all the dispatch of our actions through thunk.
Now React is going to apply the thunk middleware in between the action creators
and the reducers.

Whatever is in thunk will be executed in  between action creators and reducers.


## api.nasa.gov

Request api keys from NASA:

JLH9oJd4JQhNGLgBYnjnI6MxPD1aJx4gcLz0UKG4

You can start using this key to make web service requests. Simply pass your key
in the URL when making a web request. Here's an example:

https://api.nasa.gov/planetary/apod?api_key=JLH9oJd4JQhNGLgBYnjnI6MxPD1aJx4gcLz0UKG4


## Multiple reducers

We can have multiple specialized reducers but createStore only accepts one. So,
inside our reducers directory we can create multiple reducers but also have an
index.js file that combines them, so they can all be imported into createStore



## Render something conditionally

An example of how I can render something conditionally using the shortcut
operator &&

It evaluates the left side and if it's true it will show the left side.
If it's false, it will evaluate the right side, and show something.

```
// showing an error if we have it

{ props.error && <p className="error">{props.error}</p>}



// Showing a <div> if we have a props.photoOfTheDay or nothing
:
{ props.photoOfTheDay && (
  <div>
    <img src={props.photoOfTheDay} alt="NASA pic" />
  </div>
)}
```



## Thunk

When we use thunk, we modify the action so it returns a function instead of an
object.
A regular action creator function (1) takes a function that returns an object with
type and payload properties.

An action with thunk middleware (2) takes a function that returns another function. This inner function gets passed the dispatch method and then returns the dispatch method with the object like for a regular function.

The dispatch method is what we can use to dispatch that action.

The dispatch method was still implicitly called before by default by the React system, now with the thunk middleware we are making it explicit because we need to add something before the dispatch happens.

Since we are adding something ourselves, we also need to dispatch it after we do
our operation.

As the example below shows, we can use arrow functions when we use thunk. Below
are some examples of different syntax that all work the same.

```
export const FETCH_PHOTO_START = 'FETCH_PHOTO_START '

// regular action
export const getPhoto = () => {
  return {
    type: FETCH_PHOTO_START
  }
}

// same action with thunk
export const getPhoto = () => {
  return function(dispatch) {
    dispatch({ type: FETCH_PHOTO_START });
  }
}

// same action with thunk and arrow function on one line
export const getPhoto = () => dispatch => dispatch({type: FETCH_PHOTO_START})


// same action with thunk, arrow function, but on two lines
export const getPhoto = () => ( dispatch ) => {
  dispatch({type: FETCH_PHOTO_START});
}
```

Action creators always return a function that without thunk return a plain
object.
This object is automatically dispatched to Redux.

If the function that is returned by the action creator is a function instead of
a plain object, React passes in the dispatch method and we have to call it
ourselves if we want to dispatch the object.

We do this to show a LOADING state. The Loading state can succeed or fail. If it
succeeds we want to then show the photo of the day. If it fails we want to show
an error message.

So we have a LOADING state, a SUCCESS state and a FAILURE state and depending on
the state we want to show something else.


## Loading state

Since we need to know if the application is in a loading state, we add isLoading
to the initial state, in the reducer:

```
// reducers/index.js

const initialState = { 
  appTitle: "NASA photo of the day (from the reducer)",
  photoOfTheDay: null,
  error: '',
  isLoading: false
}
```

We need to add isLoading to the mapStateToProps function, so it's available as a property in the component:

```
// /components/NASAPhoto.js

const mapStateToProps = state => {
  return {
    appTitle: state.appTitle,
    photoOfTheDay: state.photoOfTheDay,
    error: state.error,
    isLoading: state.isLoading
  }
}
```


We are going to show a spinner when it's loading so we add a dependency:
It's a component that shows us a spinner.

```
npm install react-loader-spinner
```

Once it's installed we can use it in our component by importing it and
configuring it through props.

```
import Loader from 'react-loader-spinner';

<Loader type="BallTriangle" height={90} width={60} color="#00BFFF" />
```

Note: height and width are to be numbers, it will give it an error if we type
height="90" because that's a string, so we need to interpolate the number
inside {} as the prop value.


## Using thunk middleware

We install and then import axios in the actions file:

```
// actions/index.js

import axios from 'axios';
```


We know that FETCH_PHOTO_START causes the transition from a normal state to a
loading state.


So inside our action creator we first dispatch the action object,
then we call axios to kick off a call to our api.
Axios makes calls asynchronously.
Based on the result of the api call we are going to do another dispatch.

If we have success, we want to transition to the success state.
So in the .then clause we dispatch an action that handles the success.

So, this action creator creates three different actions based on some condition,
so that's why we use thunk, because we don't know beforehand which condition
will be.

On success it dispatches an action of FETCH_PHOTO_SUCCESS with a payload of
res.data that should contain the photo URL.

On Failure it dispatches and action of FETCH_PHOTO_FAILURE with a payload of the
error passed in.

We immediately display FETCH_PHOTO_START so we can display the spinner while axios is resolving the api call.


```
export const getPhoto = () => ( dispatch ) => {
  dispatch({type: FETCH_PHOTO_START});

  axios.get('https://api.nasa.gov/planetary/apod?api_key=JLH9oJd4JQhNGLgBYnjnI6MxPD1aJx4gcLz0UKG4')
    .then(res => dispatch({ type: FETCH_PHOTO_SUCCESS, payload: res.data }))
    .catch(err => dispatch({ type: FETCH_PHOTO_FAILURE, payload: err }))
}
```


## Reducer

In our reducer we need to account for all these 3 actions, so we import the 3
actions and then we create a case statement for each one.
Below is the reducer:

```
import { FETCH_PHOTO_START, FETCH_PHOTO_SUCCESS, FETCH_PHOTO_FAILURE } from '../actions';

const initialState = { 
  appTitle: "NASA photo of the day",
  photoOfTheDay: null,
  error: '',
  isLoading: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_PHOTO_START: {
      return {
        ...state,
        error: "",
        isLoading: true
      }
    }

    case FETCH_PHOTO_SUCCESS: {
      console.log('ACTION PAYLOAD:', action.payload);

      return {
        ...state,
        error: '',
        photoOfTheDay: action.payload,
        isLoading: false
      }
    }

    case FETCH_PHOTO_FAILURE: {
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      }
    }

    default: return state;
  }
}
```

Note that action.payload for Success contains res.data, which is a full object returned by the Nasa api. This object has properties like copyright, url, etc. that we use to populate the page.

Also note that in the Failure case we return the action.payload.message. This is
because what is returned by the api is an error object and if I try to display
it in React it gives me an error saying an error object cannot be used as a
child. The error object has a message, that we can display instead.
This should probably be set in the action, though, instead of the reducer.



```
{ props.photoOfTheDay && (
  <div className="picture">
    <img src={props.photoOfTheDay.url} alt="NASA pic" />

    <h3>{props.photoOfTheDay.title}</h3>
    <h4>{props.photoOfTheDay.date}</h4>

    <p>{props.photoOfTheDay.explanation}</p>
    <p>Photo by: {props.photoOfTheDay.copyright}</p>
  </div>
)}
```


## Custom middleware

We are going to create our custom middleware to see how it works.
We create a logger.js file inside src.
logger.js has this code:

```
export const logger = store => next => action => {
  console.group(action.type);
  console.log(action);
  console.log(store.getState());
  next(action);
  console.log(store.getState());
  console.groupEnd();
}
```

This is what a middleware function looks like.

It's a function that takes `store`, that returns a function that takes `next` and returns a function that takes `action`

To use this middleware, we import it in index.js and we add it to
applyMiddleware. We can add any middleware to applyMiddleware.

```
// src/index.js

import { logger } from './logger.js';

const store = createStore(rootReducer, applyMiddleware(thunk, logger));
```
