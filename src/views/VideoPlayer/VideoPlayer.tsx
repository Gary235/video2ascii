import { FC, MutableRefObject, useContext } from "react";

import PlayPauseRestartButton from "../../components/PlayPauseRestartButton";
import Volume from "../../components/Volume";
import ProgressBar from "../../components/ProgressBar";
import CloseVideoButton from "../../components/CloseVideoButton";
import CopyFrameButton from "../../components/CopyFrameButton";
import VideoContext from "../../contexts/VideoContext";
import BWButton from "../../components/BWButton";

interface IProps {
  playerRef: MutableRefObject<HTMLPreElement | null>;
}

const VideoPlayer: FC<IProps> = ({playerRef}) => {
  const {videoUploaded, videoRef} = useContext(VideoContext);

  return (
    <section className={`video-player ${!videoUploaded ? 'hidden' : ''}`}>
      <div className="options">
        <CloseVideoButton />
        <CopyFrameButton playerRef={playerRef} />
        <BWButton />
      </div>
      <pre id="ascii" ref={playerRef} />
      <div className="controls">
        <PlayPauseRestartButton />
        <Volume />
        <ProgressBar />
      </div>
      <h1>{videoRef?.current?.getAttribute('videoTitle') ?? ''}</h1>
    </section>
  )
}

export default VideoPlayer
