import React from "react";
import * as $ from "jquery";
import "./RecentlyPlayedList.css";
import moment from "moment";


class RecentlyPlayedList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {start_song: null,
                  end_song: null,
                  footer_text: "Select start song",
                  user_id: null,
                  playlist_id: null,
                  playlist_uri: null,
                  playlist_completed: false,
                  }
    this.handleRowClick = this.handleRowClick.bind(this)
    this.handleCreatePlaylistClick = this.handleCreatePlaylistClick.bind(this)
  }



  handleRowClick(row_index) {
     if (this.state.start_song === null) {
      this.setState((_, __) => {
             return {start_song: row_index,
                     footer_text: "Select end song"};
      })
    }
    else if (this.state.end_song === null && row_index >= this.state.start_song) {
      this.setState((_, __) => {
             return {end_song: row_index,
                     footer_text: "Create playlist!"};
      })
    }

  }

   getBgColor(index) {
      const bgColors = {
        white: "ffffff",
        blue: "#00B1E1",
        green: "lightgreen",
        red: "#E9573F"
      }

     if (index === this.state.start_song) {
       return bgColors.green
     } else if (index === this.state.end_song) {
       return bgColors.red
     } else {
       return bgColors.white
     }

  }

  createRecentlyPlayedPlaylist(token, uris) {
    // Make a call using the token
    var that = this

    function getUserId() {
      return $.ajax({
        url: "https://api.spotify.com/v1/me",
        type: "GET",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (data) => {
          that.setState({user_id: data.id});
        }
      });
    }

    function createPlaylist() {
      // TODO: Add date or something to improve Playlist Name
      return $.ajax({
        url: "https://api.spotify.com/v1/users/" +
              that.state.user_id + "/playlists",
        data: JSON.stringify({name: "Recently Played Songs", public: false}),
        type: "POST",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (data) => {
          that.setState({playlist_id: data.id,
                         playlist_uri: data.uri});
        }
      });
    }

    function addSongsToPlaylist() {
      return $.ajax({
        url: "https://api.spotify.com/v1/playlists/" +
              that.state.playlist_id + "/tracks",
        type: "POST",
        data: JSON.stringify({uris: uris}),
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (data) => {
          that.setState({playlist_completed: true})
        }
      });
    }

    return getUserId().then(createPlaylist).then(addSongsToPlaylist)
  }

  handleCreatePlaylistClick() {
    console.log("handleing CreatePlaylistClick")

    if (this.state.start_song !== null && this.state.end_song !== null) {
      const uris = this.props.recently_played
        .slice(this.state.start_song, this.state.end_song+1)
        .map((song, _) =>
              song.track.uri)
      this.createRecentlyPlayedPlaylist(this.props.token, uris)
        .then(() => window.open(this.state.playlist_uri, "_self"))
    }
  }

  render() {
    return (
      <div className="App">
        <div className='panel panel-default'>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Song title</th>
                  <th scope="col"> Artist </th>
                  <th scope="col" className='date'>Time</th>
                </tr>
              </thead>

                <tbody>{this.props.recently_played &&
                        this.props.recently_played
                          .map((song_played, index) =>
                            <Song index={index}
                                  track={song_played.track}
                                  played_at={song_played.played_at}
                                  handleClick={this.handleRowClick}
                                  bgColor= {() => this.getBgColor(index)}
                                  key={index}
                                  />)
                        }
                </tbody>
            </table>
          </div>
        </div>

          {this.state.start_song !== null && this.state.end_song !== null &&
              <div className="footer" onClick={this.handleCreatePlaylistClick}>
                {this.state.footer_text}
              </div>
          }
      </div>
    );
  }
}

function Song(props) {
  return (
    <tr
    key={props.index}
    onClick={() => props.handleClick(props.index)}
    style={{backgroundColor: props.bgColor()}}>
    <td scope="row">{props.index + 1}</td>
    <td>{props.track.name}</td>
    <td>{props.track.artists[0].name}</td>
    <td className='date'>{moment(props.played_at).format('ddd h:mma')}</td>
    </tr>
  );
}

export default RecentlyPlayedList;
