import { FC, useContext, useRef } from "react";
import VideoContext from "../contexts/VideoContext";

const BWButton: FC = () => {
  const {setBw, bw, playing} = useContext(VideoContext);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const toggleBw = () => {
    setBw(!bw)
    if (!btnRef.current) return;

    if (bw) btnRef.current.style.animation = 'activate-colors 200ms ease-out forwards'
    else btnRef.current.style.animation = 'deactivate-colors 200ms ease-out forwards'
  }

  const title = !playing ? 'change colors while playing' : bw ? 'show colors' : 'show black & white'
  return (
    <button ref={btnRef} title={title} onClick={toggleBw} style={{fontSize: 30}} disabled={!playing}>◑</button>
  )
}

export default BWButton