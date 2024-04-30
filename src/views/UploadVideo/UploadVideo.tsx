import { ChangeEvent, FC, MutableRefObject, useContext, useRef } from "react";

import { convertToGrayScales, drawAscii } from "../../utils/ascii";
import { INSERT_VIDEO_BODY, INSERT_VIDEO_BORDER, PEOPLE } from "../../constants/ascii-art";
import { H_PX_PER_CHAR, W_PX_PER_CHAR } from "../../constants/lengths";
import VideoContext from "../../contexts/VideoContext";
import { DEFAULT_VOLUME } from "../../constants/volume";

interface IProps {
  playerRef: MutableRefObject<HTMLPreElement | null>;
}

const UploadVideo: FC<IProps> = ({playerRef}) => {
  const {videoRef, setEnded, setProgress, setLoadedMetadata, setVideoUploaded, videoUploaded} = useContext(VideoContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onVideoUploaded = (e: ChangeEvent<HTMLInputElement>) => {
    if (!videoRef?.current || !e.target?.files) return;

    const media = URL.createObjectURL(e.target.files[0]);
    videoRef.current.src = media;
    videoRef.current.style.display = "block";
    videoRef.current.volume = DEFAULT_VOLUME;
    videoRef.current.currentTime = 0.1;
    setVideoUploaded(true);
  }

  const captureVideo = (video: HTMLVideoElement) => {
    if (!canvasRef.current || !playerRef.current) return;

    const {width: playerWidth, height: playerHeight} = document.getElementById('ascii')!.getBoundingClientRect();
    const MAX_CHAR_WIDTH = Math.floor(playerWidth / W_PX_PER_CHAR);
    const MAX_CHAR_HEIGHT = Math.floor(playerHeight / H_PX_PER_CHAR);

    const width = Math.floor(Math.min(video.videoWidth, playerWidth) / W_PX_PER_CHAR)
    const height = Math.floor(Math.min(video.videoHeight, playerHeight) / H_PX_PER_CHAR)

    if (!width || !height) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const canvasContext = canvasRef.current.getContext("2d", {willReadFrequently: true});
    canvasContext?.drawImage(video, 0, 0, width, height);
    const grayScales = convertToGrayScales(canvasContext, width, height);

    drawAscii(grayScales, width, height, playerRef, MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT);
    setProgress(video.currentTime);
  }

  return (
    <section className={`video-upload ${videoUploaded ? 'uploaded' : ''}`}>
      <label htmlFor="inputVideo" className={videoUploaded ? 'hidden' : ''}>
        <div className="insert-video">
          <pre className="border-top">{INSERT_VIDEO_BORDER}</pre>
          <pre className="body">{INSERT_VIDEO_BODY}</pre>
          <pre className="border-bottom">{INSERT_VIDEO_BORDER}</pre>
        </div>
      </label>

      <pre>{PEOPLE}</pre>

      {/* HIDDEN */}
      <input
        type="file"
        id="inputVideo"
        name="inputVideo"
        className="hidden"
        onChange={onVideoUploaded}
      />
      <video
        id="video"
        ref={videoRef}
        width={230}
        className="hidden"
        onTimeUpdate={(e) => captureVideo(e.target as HTMLVideoElement)}
        onEnded={() => setEnded(true)}
        onLoadedMetadata={() => setLoadedMetadata(true)}
      ></video>
      <canvas id="canvas" ref={canvasRef} className="hidden"></canvas>
    </section>
  )
}

export default UploadVideo
