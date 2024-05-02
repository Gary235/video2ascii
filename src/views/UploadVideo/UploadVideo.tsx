import { ChangeEvent, FC, MutableRefObject, useContext, useEffect, useRef } from "react";

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
  const {
    videoRef,
    videoUploaded,
    bw,
    bwRef,
    playing,
    setEnded,
    setProgress,
    setLoadedMetadata,
    setVideoUploaded,
    setPlaying
  } = useContext(VideoContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasBGRef = useRef<HTMLCanvasElement | null>(null);
  const charLengths = useRef<ICharLengths>({charHeight: null, charWidth: null, maxCharHeight: null, maxCharWidth: null});

  useEffect(() => {
    if (playing || !videoRef?.current) return;

    captureVideo(videoRef.current);
  }, [bw])

  const onVideoUploaded = (e: ChangeEvent<HTMLInputElement>) => {
    if (!videoRef?.current || !e.target?.files) return;

    charLengths.current.charWidth = null;
    const media = URL.createObjectURL(e.target.files[0]);
    videoRef.current.src = media;
    videoRef.current.style.display = "block";
    videoRef.current.volume = DEFAULT_VOLUME;
    videoRef.current.currentTime = 0.1;
    setVideoUploaded(true);
    setEnded(false);
    setProgress(0);
    setPlaying(false)
  }

  const captureVideo = (video: HTMLVideoElement) => {
    if (bwRef === null || !canvasBGRef.current || !canvasRef.current || !playerRef.current) return;

    const {width: playerWidth, height: playerHeight} = document.getElementById('ascii')!.getBoundingClientRect();

    let {charWidth, charHeight, maxCharHeight, maxCharWidth} = charLengths.current;
    if (charWidth === null && video.videoWidth) {
      charWidth = Math.floor(Math.min(video.videoWidth, playerWidth) / W_PX_PER_CHAR)
      charHeight = Math.floor(Math.min(video.videoHeight, playerHeight) / H_PX_PER_CHAR)
      maxCharWidth = Math.floor(playerWidth / W_PX_PER_CHAR);
      maxCharHeight = Math.floor(playerHeight / H_PX_PER_CHAR);

      charLengths.current = {charHeight, charWidth, maxCharHeight, maxCharWidth};

      canvasRef.current.width = charWidth;
      canvasRef.current.height = charHeight;

      canvasBGRef.current.width = playerWidth;
      canvasBGRef.current.height = playerHeight;
    }

    if (!charWidth || !charHeight) return;

    const canvasContext = canvasRef.current.getContext("2d", {willReadFrequently: true});
    canvasContext?.drawImage(video, 0, 0, charWidth, charHeight);
    const grayScales = convertToGrayScales(canvasContext, charWidth, charHeight);

    if (!bwRef.current) {
      const canvasBGContext = canvasBGRef.current.getContext("2d", {willReadFrequently: true});
      canvasBGContext?.drawImage(video, 0, 0, playerWidth, playerHeight);
      playerRef.current.classList.add('colors');
      playerRef.current.style.backgroundImage = `url(${canvasBGRef.current.toDataURL()})`;
    } else if (playerRef.current.style.backgroundImage !== 'none') {
      playerRef.current.classList.remove('colors');
      playerRef.current.style.backgroundImage = 'none';
    }

    drawAscii(grayScales, charWidth, charHeight, playerRef, maxCharWidth!, maxCharHeight!, bwRef.current!);
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
        onEnded={() => {setEnded(true); setPlaying(false)}}
        onLoadedMetadata={() => setLoadedMetadata(true)}
      ></video>
      <canvas id="canvas" ref={canvasRef} className="hidden"></canvas>
      <canvas id="canvas-bg" ref={canvasBGRef} className="hidden"></canvas>
    </section>
  )
}

export default UploadVideo
