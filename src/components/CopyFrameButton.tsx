import { FC, MutableRefObject, useRef } from "react";

interface IProps {
  playerRef: MutableRefObject<HTMLPreElement | null>;
}


const CopyFrameButton: FC<IProps> = ({playerRef}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const copyFrame = () => {
    navigator.clipboard.writeText(playerRef.current?.textContent ?? '');
    if (!btnRef.current) return;

    btnRef.current.style.animation = 'frame-copied 1s ease-in-out forwards';
    setTimeout(() => btnRef.current && (btnRef.current.style.animation = ''), 1000)
  }

  return (
    <button title="copy frame" onClick={copyFrame} ref={btnRef}>✦</button>
  )
}

export default CopyFrameButton