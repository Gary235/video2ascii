import { FC, useContext, MouseEvent } from "react";
import VideoContext from "../contexts/VideoContext";
import { DEFAULT_VOLUME, VOLUME_LEVELS } from "../constants/volume";

const Volume: FC = () => {
  const {videoRef} = useContext(VideoContext);

  const onVolumeLevelHover = (e: MouseEvent<HTMLParagraphElement>) => {
    const target = e.target as HTMLParagraphElement;
    const volumeLevel = Number(target.getAttribute('volume-level') ?? -1);
    if (volumeLevel === -1) return;

    for (let i = 0; i < 6; i++) {
      const t = document.querySelector(`.volume-level[volume-level="${i}"]`)
      if (i <= volumeLevel) {
        t?.classList.add('preview-on')
        t?.classList.remove('preview-off');
      } else {
        t?.classList.add('preview-off');
        t?.classList.remove('preview-on')
      }
    }
  }

  const onVolumeUnhover = () => {
    for (let i = 0; i < 6; i++) {
      const t = document.querySelector(`.volume-level[volume-level="${i}"]`)
      t?.classList.remove('preview-on');
      t?.classList.remove('preview-off');
    }
  }

  const onVolumeLevelClick = (e: MouseEvent<HTMLParagraphElement>) => {
    const target = e.target as HTMLParagraphElement;
    const volumeLevel = Number(target.getAttribute('volume-level') ?? -1);
    if (volumeLevel === -1) return;

    for (let i = 0; i < 6; i++) {
      const t = document.querySelector(`.volume-level[volume-level="${i}"]`)
      if (i <= volumeLevel) {
        t?.classList.add('on')
        t?.classList.remove('off');
      } else {
        t?.classList.add('off');
        t?.classList.remove('on')
      }
    }

    if (videoRef?.current) videoRef.current.volume = volumeLevel * 0.2;
  }


  return (
    <span className="volume" onMouseLeave={onVolumeUnhover}>
      {VOLUME_LEVELS.map(vl => (
        <p
          onClick={onVolumeLevelClick}
          onMouseOver={onVolumeLevelHover}
          className={`volume-level ${Number(vl.level) * 0.2 <= DEFAULT_VOLUME ? 'on' : 'off'}`}
          volume-level={vl.level}
          title={vl.title}
          key={`volume-${vl.title}`}
        >
          {vl.content}
        </p>
      ))}
    </span>
  )
}

export default Volume;
