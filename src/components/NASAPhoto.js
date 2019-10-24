import React from 'react';

import { connect } from 'react-redux';
import { getPhoto } from '../actions';
import Loader from 'react-loader-spinner';

const NASAPhoto = props => {

  const fetchPhoto = e => {
    e.preventDefault();
    props.getPhoto();
  }

  return (
    <>
      <h2>{props.appTitle}</h2>

      { props.isLoading && (
        <Loader type="BallTriangle" height={90} width={60} color="#00BFFF" />
      )}

      { props.error && <p className="error">{props.error}</p>}


      { props.photoOfTheDay && (
        <div className="picture">
          <img src={props.photoOfTheDay.url} alt="NASA pic" />

          <h3>{props.photoOfTheDay.title}</h3>
          <h4>{props.photoOfTheDay.date}</h4>

          <p>{props.photoOfTheDay.explanation}</p>
          <p>Photo by: {props.photoOfTheDay.copyright}</p>
        </div>
      )}


      <button onClick={fetchPhoto}>Fetch Photo</button>
    </>
  )
}

const mapStateToProps = state => {
  return {
    appTitle: state.appTitle,
    photoOfTheDay: state.photoOfTheDay,
    error: state.error,
    isLoading: state.isLoading
  }
}

export default connect(
  mapStateToProps,
  { getPhoto }
)(NASAPhoto);



