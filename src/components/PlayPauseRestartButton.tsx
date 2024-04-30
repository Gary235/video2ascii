import { FC, useContext } from "react";
import VideoContext from "../contexts/VideoContext";

const PlayPauseRestartButton: FC = () => {
  const {playing, setPlaying, videoRef, ended, setEnded} = useContext(VideoContext);

  const togglePlay = () => {
    if (!videoRef?.current) return;

    if (ended) {
      videoRef.current.currentTime = 0;
      setEnded(false);
      setPlaying(false)
      return;
    }

    if (playing) videoRef.current?.pause()
    else videoRef.current?.play()
    setPlaying(!playing);
  }

  const content = ended ? '⟲' : playing ? '■' : '▲';
  const title = ended ? 'restart' : playing ? 'pause' : 'play';
  return (
    <button
      className={`play-pause-btn ${playing ? 'playing': 'paused'}`}
      onClick={togglePlay}
      title={title}
    >
      {content}
    </button>
  )
}

export default PlayPauseRestartButton