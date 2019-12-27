import React, { Component } from "react";
import * as $ from "jquery";
import "../node_modules/hash.js";
import RecentlyPlayedList from "./RecentlyPlayedList";
import logo from "./logo.svg";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';


const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "2dd8785aefe9492ab77fdbbfdc7470e0";
const redirectUri = "http://localhost:3000/";

const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-read-recently-played",
    "playlist-modify-private",
    "playlist-read-private",
];

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = "";


class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      recently_played: null,
      start_time: null,
      end_time: null,
    };
    this.getRecentlyPlayed = this.getRecentlyPlayed.bind(this);
  }
  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getRecentlyPlayed(_token);
    }
  }

  getRecentlyPlayed(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {

        const played_at_times = data.items.map(song_played => {
          return Date(song_played.played_at);
        });

        this.setState({
          recently_played: data.items,
          min: Math.min(...played_at_times),
          max: Math.max(...played_at_times),
        });
      }
    });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && (
            <RecentlyPlayedList
              recently_played={this.state.recently_played}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
