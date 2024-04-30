import { ChangeEvent, FC, MutableRefObject, useContext, useRef } from "react";

import { convertToGrayScales, drawAscii } from "../../utils/ascii";
import { INSERT_VIDEO_BODY, INSERT_VIDEO_BORDER, PEOPLE } from "../../constants/ascii-art";
import { H_PX_PER_CHAR, W_PX_PER_CHAR } from "../../constants/lengths";
import VideoContext from "../../contexts/VideoContext";
import { DEFAULT_VOLUME } from "../../constants/volume";

interface IProps {
  playerRef: MutableRefObject<HTMLPreElement | null>;
}

interface ICharLengths {
  charHeight: number | null;
  charWidth: number | null;
  maxCharHeight: number | null;
  maxCharWidth: number | null;
}


const UploadVideo: FC<IProps> = ({playerRef}) => {
  const {videoRef, setEnded, setProgress, setLoadedMetadata, setVideoUploaded, videoUploaded} = useContext(VideoContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const charLengths = useRef<ICharLengths>({charHeight: null, charWidth: null, maxCharHeight: null, maxCharWidth: null});

  const onVideoUploaded = (e: ChangeEvent<HTMLInputElement>) => {
    if (!videoRef?.current || !e.target?.files) return;

    charLengths.current.charWidth = null;
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

    let {charWidth, charHeight, maxCharHeight, maxCharWidth} = charLengths.current;
    if (charWidth === null && video.videoWidth) {
      charWidth = Math.floor(Math.min(video.videoWidth, playerWidth) / W_PX_PER_CHAR)
      charHeight = Math.floor(Math.min(video.videoHeight, playerHeight) / H_PX_PER_CHAR)
      maxCharWidth = Math.floor(playerWidth / W_PX_PER_CHAR);
      maxCharHeight = Math.floor(playerHeight / H_PX_PER_CHAR);

      charLengths.current = {charHeight, charWidth, maxCharHeight, maxCharWidth};
    }

    if (!charWidth || !charHeight) return;

    canvasRef.current.width = charWidth;
    canvasRef.current.height = charHeight;

    const canvasContext = canvasRef.current.getContext("2d", {willReadFrequently: true});
    canvasContext?.drawImage(video, 0, 0, charWidth, charHeight);
    const grayScales = convertToGrayScales(canvasContext, charWidth, charHeight);

    drawAscii(grayScales, charWidth, charHeight, playerRef, maxCharWidth!, maxCharHeight!);
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

      <pre className="people">{PEOPLE}</pre>

      {/* HIDDEN */}
      <input
        type="file"
        id="inputVideo"
        name="inputVideo"
        className="hidden"
        accept="video/*"
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
