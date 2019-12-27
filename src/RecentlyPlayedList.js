import React from "react";
import "./RecentlyPlayedList.css";
import moment from "moment";


const RecentlyPlayedList = props => {

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

              <tbody>{props.recently_played &&
                      props.recently_played
                        .reverse()
                        .map((song_played, index) =>
                          Song(index, song_played.track, song_played.played_at))
                      }
              </tbody>

          </table>
        </div>
      </div>

      <div className="footer">I'm a footer</div>
    </div>
  );
}

const Song = (index, track, played_at) => {

  return (
    <tr key={played_at} >
    <td scope="row">{index + 1}</td>
    <td><a href={track.uri} target="_blank">{track.name}</a></td>
    <td>{track.artists[0].name}</td>
    <td className='date'>{moment(played_at).format('ddd h:mma')}</td>
    </tr>
  );
}

export default RecentlyPlayedList;
