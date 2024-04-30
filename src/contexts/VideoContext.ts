import { MutableRefObject, createContext } from 'react';

interface IVideoContext {
  videoRef: MutableRefObject<HTMLVideoElement | null> | null,
  playing: boolean,
  ended: boolean,
  progress: number,
  loadedMetadata: boolean,
  videoUploaded: boolean,
  bw: boolean;
  bwRef: MutableRefObject<boolean> | null;
  setPlaying: (p: boolean) => void,
  setEnded: (e: boolean) => void,
  setProgress: (p: number) => void,
  setVideoRef: (t: HTMLVideoElement) => void,
  setLoadedMetadata: (l: boolean) => void,
  setVideoUploaded: (l: boolean) => void,
  setBw: (bw: boolean) => void,
}

const VideoContext = createContext<IVideoContext>({
  videoRef: null,
  playing: false,
  ended: false,
  progress: 0,
  loadedMetadata: false,
  videoUploaded: false,
  bw: true,
  bwRef: null,
  setPlaying: () => {},
  setEnded: () => {},
  setProgress: () => {},
  setVideoRef: () => {},
  setLoadedMetadata: () => {},
  setVideoUploaded: () => {},
  setBw: () => {},
});

export default VideoContext