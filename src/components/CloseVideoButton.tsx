import { FC, useContext } from "react";
import VideoContext from "../contexts/VideoContext";

const CloseVideoButton: FC = () => {
  const {setVideoUploaded, videoRef, setLoadedMetadata} = useContext(VideoContext);

  const closeVideo = () => {
    setVideoUploaded(false);
    if (videoRef?.current) {
      videoRef.current.src = '';
      setLoadedMetadata(false)
    }
  }

  return (
    <button title="close video" onClick={closeVideo}>☒</button>
  )
}

export default CloseVideoButton