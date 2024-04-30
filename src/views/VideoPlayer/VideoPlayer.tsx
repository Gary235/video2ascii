import { FC, MutableRefObject, useContext } from "react";

import PlayPauseRestartButton from "../../components/PlayPauseRestartButton";
import Volume from "../../components/Volume";
import ProgressBar from "../../components/ProgressBar";
import CloseVideoButton from "../../components/CloseVideoButton";
import CopyFrameButton from "../../components/CopyFrameButton";
import VideoContext from "../../contexts/VideoContext";

interface IProps {
  playerRef: MutableRefObject<HTMLPreElement | null>;
}

const VideoPlayer: FC<IProps> = ({playerRef}) => {
  const {videoUploaded} = useContext(VideoContext);

  return (
    <section className={`video-player ${!videoUploaded ? 'hidden' : ''}`}>
      <div className="options">
        <CloseVideoButton />
        <CopyFrameButton playerRef={playerRef} />
      </div>
      <pre id="ascii" ref={playerRef} />
      <div className="controls">
        <PlayPauseRestartButton />
        <Volume />
        <ProgressBar />
      </div>
    </section>
  )
}

export default VideoPlayer
