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
      return {
        ...state,
        error: '',
        photoOfTheDay: action.payload,
        isLoading: false
      }
    }

    case FETCH_PHOTO_FAILURE: {
      console.log("FAILURE PAYLOAD:", action.payload)
      return {
        ...state,
        error: action.payload.message,
        isLoading: false
      }
    }

    default: return state;
  }
}

export default reducer;
