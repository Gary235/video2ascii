import { useRef, useState } from "react"

import UploadVideo from "./views/UploadVideo";
import VideoPlayer from "./views/VideoPlayer";
import VideoContext from "./contexts/VideoContext";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLPreElement | null>(null);
  const bwRef = useRef(true)

  const [videoUploaded, setVideoUploaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loadedMetadata, setLoadedMetadata] = useState(false);
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bw, _setBw] = useState(true)

  const setVideoRef = (target: HTMLVideoElement) => (videoRef.current = target)
  const setBw = (val: boolean) => {
    _setBw(val);
    bwRef.current = val
  }

  const value = {
    videoRef,
    ended,
    playing,
    progress,
    loadedMetadata,
    videoUploaded,
    bw,
    bwRef,
    setEnded,
    setPlaying,
    setProgress,
    setVideoRef,
    setLoadedMetadata,
    setVideoUploaded,
    setBw,
  }

  return (
    <VideoContext.Provider value={value}>
      <main>
        <VideoPlayer playerRef={playerRef} />
        <UploadVideo playerRef={playerRef} />
      </main>
    </VideoContext.Provider>
  )
}

export default App
