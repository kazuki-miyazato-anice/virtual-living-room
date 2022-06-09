import { Suspense, useEffect, useRef, useState } from "react"
import { VideoTexture, AudioLoader, } from "three"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  Plane,
  Environment,
  PerspectiveCamera,
  EnvironmentCube,
  PositionalAudio,
  useProgress,
  Loader,
} from "@react-three/drei"
import Remo from './Remo'
import License from "./License"

function Video({args, position, rotation, isPlaying}) {
  const [videoTexture, setVideoTexture] = useState(false)
  const [video, setVideo] = useState(null)
  const [opacity, setOpacity] = useState(0)
  useEffect(() => {
    const video = document.createElement('video')
    video.autoplay = true
    video.muted = true
    video.loop = true
    const source = document.createElement('source')
    source.src = 'video.mp4'
    source.type = 'video/mp4'
    video.appendChild(source)
    setVideo(video)
    const texture = new VideoTexture(video)
    setVideoTexture(texture)
  },[])
  useEffect(() => {
    if( !video ) {
      return
    }
    if(isPlaying) {
      video.play()
      setOpacity(0.75)
    } else {
      video.pause()
      setOpacity(0)
    }
  }, [isPlaying])

  return isPlaying && (
    <Plane args={args} position={position} rotation={rotation}>
      <meshBasicMaterial attach="material" map={videoTexture} opacity={opacity} transparent />
    </Plane>
  )
}

function Audio({position, isPlaying}) {
  const [buffer, setBuffer] = useState(null)
  const audioLoader = new AudioLoader()
  const audioPath = 'River%20Meditation.mp3'
  const audio = useRef()
  const onLoadBuffer = buffer => {
    setBuffer(buffer)
    audio.current.setBuffer(buffer)
    audio.current.play()
  }
  useEffect(() => {
    if( !audio.current ) {
      return
    }
    if( isPlaying ) {
      if( !buffer ) {
        audioLoader.load( audioPath, onLoadBuffer)
      } else {
        audio.current.play()
      }
    } else {
      audio.current.pause()
    }
  }, [isPlaying])
  return <PositionalAudio
    ref={audio}
    position={position}
    url={audioPath}
    distance={1}
    muted={false}
    autoplay={false}
    loop
  />
}

function values(debug = false) {
  if( debug ) {
    return useControls({
      posX: {
        value: -64,
        min: -5000,
        max: 5000,
        step: 1,
      },
      posY: {
        value: 34,
        min: -5000,
        max: 5000,
        step: 1,
      },
      posZ: {
        value: 193,
        min: -5000,
        max: 5000,
        step: 1,
      },
      meshW: {
        value: 28.70,
        min: 27,
        max: 30,
        step: 0.01,
      },
      meshH: {
        value: 16.58,
        min: 14,
        max: 20,
        step: 0.01,
      },
      meshPosX: {
        value: 12.96,
        min: 10,
        max: 14,
        step: 0.01,
      },
      meshPosY: {
        value: -4.56,
        min: -6,
        max: -4,
        step: 0.01,
      },
      meshPosZ: {
        value: -49.00,
        min: -50,
        max: -48,
        step: 0.01,
      },
      meshRotX: {
        value: 0.06,
        min: -1,
        max: 1,
        step: 0.01,
      },
      meshRotY: {
        value: -0.01,
        min: -1,
        max: 1,
        step: 0.01,
      },
      meshRotZ: {
        value: -0.03,
        min: -1,
        max: 1,
        step: 0.01,
      }
    })
  }
  return {
    posX: -64,
    posY: 34,
    posZ: 193,
    meshW: 28.70,
    meshH: 16.58,
    meshPosX: 12.96,
    meshPosY: -4.56,
    meshPosZ: -49.00,
    meshRotX: 0.06,
    meshRotY: -0.01,
    meshRotZ: -0.03,
  }
}

export default function App() {
  const {
    posX,
    posY,
    posZ,
    meshW,
    meshH,
    meshPosX,
    meshPosY,
    meshPosZ,
    meshRotX,
    meshRotY,
    meshRotZ,
  } = values()
  const [isPlaying, play] = useState(false)
  const remoOnClick = () => play(!isPlaying)
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Canvas shadows>
          <PerspectiveCamera position={[posX, posY, posZ]} makeDefault />
          <Environment frames={Infinity} resolution={4096} background>
            <EnvironmentCube near={1} far={1000} files={['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']} background/>
            <Video args={[meshW, meshH, 64, 64]} position={[meshPosX, meshPosY, meshPosZ]} rotation={[meshRotX, meshRotY, meshRotZ]} isPlaying={isPlaying} />
          </Environment>
          <Audio position={[meshPosX, meshPosY, meshPosZ]} isPlaying={isPlaying}/>
          <Remo onClick={remoOnClick} />
          <OrbitControls />
        </Canvas>
      </Suspense>
      <License />
    </>
  );
}
