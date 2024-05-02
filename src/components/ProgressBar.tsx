import { FC, useContext, useEffect, useMemo, useRef, useState } from "react"
import VideoContext from "../contexts/VideoContext";
import { W_PX_PER_CHAR } from "../constants/lengths";

const ProgressBar: FC = () => {
  const {
    playing,
    videoRef,
    progress,
    loadedMetadata,
    ended,
    setProgress,
    setEnded,
  } = useContext(VideoContext);

  const [stepCount, setStepCount] = useState(0);
  const [stepDuration, setStepDuration] = useState(0);
  const [markerPos, _setMarkerPos] = useState(
    Math.max(progress * 1000 / stepDuration * W_PX_PER_CHAR * 2 - W_PX_PER_CHAR * 2, -10) || -10
  );
  const progressRef = useRef<HTMLDivElement | null>(null)
  const dragging = useRef(false);
  const markerPosRef = useRef(markerPos);

  const setMarkerPos = (newPos: number) => {
    _setMarkerPos(newPos);
    markerPosRef.current = newPos;
  }

  const steps = useMemo(
    () => new Array(stepCount).fill(0).map((_, i) => i * stepDuration),
    [stepCount, stepDuration]
  );

  useEffect(() => {
    if (!progressRef.current || !loadedMetadata) return;
    const {width} = progressRef.current.getBoundingClientRect();
    const progressSteps = Math.floor(width / W_PX_PER_CHAR / 2);
    setStepCount(progressSteps)
    setStepDuration(Math.floor((videoRef?.current?.duration ?? 0) / progressSteps * 1000))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedMetadata])

  useEffect(() => {
    setMarkerPos(Math.max(progress * 1000 / stepDuration * W_PX_PER_CHAR * 2 - W_PX_PER_CHAR * 2, -10) || -10)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  const onMouseDown = () => {
    if (!videoRef?.current?.paused) videoRef?.current?.pause();
    dragging.current = true;

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseUp = () => {
    if (playing) videoRef?.current?.play();
    dragging.current = false;

    if (progressRef.current && videoRef?.current) {
      const {width} = progressRef.current.getBoundingClientRect();
      const percentage = markerPosRef.current * 100 / width;
      const currentTime = percentage * videoRef.current.duration / 100;
      videoRef.current.currentTime = currentTime;
      setProgress(currentTime)

      if (ended) setEnded(false);
    }

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !progressRef.current) return;

    const {left = 0, width = 0} = progressRef.current.getBoundingClientRect();

    let pos = markerPosRef.current;
    if (e.pageX < left) {
      pos = -10;
    } else if (e.pageX > (left + width)) {
      // pos = markerPosRef.current
    } else {
      pos =  e.pageX - left
    }

    if (pos !== markerPosRef.current) setMarkerPos(pos);
  }

  const onStepClick = (time: number) => {
    if (!videoRef?.current) return;

    const currentTime = time / 1000;
    videoRef.current.currentTime = currentTime;
    setProgress(currentTime);
    if (ended) setEnded(false);
  }

  return (
    <div className="progress" ref={progressRef}>
      <span className="progress-marker" style={{left: markerPos}} onMouseDown={onMouseDown}>☉</span>
      {steps.map((tmsp, index) => (
        <p
          key={index}
          className={`progress-step ${progress * 1000 > tmsp ? 'viewed': ''}`}
          title={`${tmsp / 1000}`}
          onClick={() => onStepClick(tmsp)}
        >
          _
        </p>
      ))}
    </div>
  )
}

export default ProgressBar