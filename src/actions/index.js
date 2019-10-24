import axios from 'axios';

export const FETCH_PHOTO_START = 'FETCH_PHOTO_START '
export const FETCH_PHOTO_SUCCESS = 'FETCH_PHOTO_SUCCESS '
export const FETCH_PHOTO_FAILURE = 'FETCH_PHOTO_FAILURE '


// export const getPhoto = () => {
//   return {
//     type: FETCH_PHOTO_START
//   }
// }
// 

// export const getPhoto = () => {
//   return function(dispatch) {
//     dispatch({ type: FETCH_PHOTO_START });
//   }
// }


// export const getPhoto = () => dispatch => dispatch({type: FETCH_PHOTO_START})


export const getPhoto = () => ( dispatch ) => {
  dispatch({type: FETCH_PHOTO_START});

  axios.get('https://api.nasa.gov/planetary/apod?api_key=JLH9oJd4JQhNGLgBYnjnI6MxPD1aJx4gcLz0UKG4')
    .then(res => dispatch({ type: FETCH_PHOTO_SUCCESS, payload: res.data }))
    .catch(err => dispatch({ type: FETCH_PHOTO_FAILURE, payload: err }))
}


// https://api.nasa.gov/planetary/apod?api_key=JLH9oJd4JQhNGLgBYnjnI6MxPD1aJx4gcLz0UKG4
