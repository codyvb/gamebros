import useDetails from 'hooks/useDetails'
import { optimizeImage } from 'lib/optmizeImage'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { FC, useEffect, useState } from 'react'

type Props = {
  details: ReturnType<typeof useDetails>
}

const TokenMedia: FC<Props> = ({ details }) => {
  const router = useRouter()
  const [tokenOpenSea, setTokenOpenSea] = useState<any>({
    animation_url: null,
    extension: null,
  })

  const token = details.data?.tokens?.[0]

  const contract = router.query?.contract?.toString()
  const tokenId = router.query?.tokenId?.toString()

  const urlOpenSea = new URL(
    `/api/v1/asset/${contract}/${tokenId}`,
    'https://api.opensea.io/'
  )

  useEffect(() => {
    async function getOpenSeaData(url: URL) {
      let result: any = { animation_url: null, extension: null }
      try {
        const res = await fetch(url.href)
        const json = await res.json()

        const animation_url = json?.animation_url
        // Get the last section of the URL
        // lastPartOfUrl = '874f68834bdf5f05982d01067776acc2.wav' when input is
        // 'https://storage.opensea.io/files/874f68834bdf5f05982d01067776acc2.wav'
        const lastPartOfUrl = animation_url?.split('/')?.pop()
        // Extract the file extension from `lastPartOfUrl`, example: 'wav'
        let extension = null
        if (lastPartOfUrl) {
          const ext = /(?:\.([^.]+))?$/.exec(lastPartOfUrl)?.[1]
          // This makes a strong assumption and it's not reliable
          if (ext?.length && ext.length > 10) {
            extension = 'other'
          } else {
            extension = ext
          }
        }

        result = { animation_url, extension }
      } catch (err) {
        console.error(err)
      }

      setTokenOpenSea(result)
    }

    if (contract && tokenId) {
      getOpenSeaData(urlOpenSea)
    }

  }, [])

  return (
    // <div className="col-span-full bg-slate-900  min-h-[200px] md:min-h-[660px] md:min-w-[660px] md:rounded-2xl drop-shadow-2xl">
    <div className="col-span-ful w-full md:rounded-2xl drop-shadow-2xl image-container" style={{

    }}> 
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      ></Script>
      <Script
        noModule
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"
      ></Script>
      {tokenOpenSea?.extension === null ? (
        <img
          alt="GameBro"
          className="md:rounded-2xl"
          src={optimizeImage(token?.token?.image , 660) || '/transparentplaceholder.png'}
        />
      ) : (
        <Media
          tokenOpenSea={tokenOpenSea}
          tokenImage={optimizeImage(token?.token?.image, 660)}
        />
      )}
      <style jsx>{`
        `}</style>
    </div>
  )
}

export default TokenMedia

const Media: FC<{
  tokenOpenSea: {
    animation_url: any
    extension: any
  }
  tokenImage: string
}> = ({ tokenOpenSea, tokenImage }) => {
  const { animation_url, extension } = tokenOpenSea

  // VIDEO
  if (extension === 'mp4') {
    return (
      <video className="mb-4 w-[533px]" controls>
        <source src={animation_url} type="video/mp4" />
        Your browser does not support the
        <code>video</code> element.
      </video>
    )
  }

  // AUDIO
  if (extension === 'wav' || extension === 'mp3') {
    return (
      <div>
        <img className="mb-4 w-[533px] rounded-2xl" src={tokenImage} alt="" />
        <audio className="mb-4 w-full" controls src={animation_url}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </div>
    )
  }

  // 3D
  if (extension === 'gltf' || extension === 'glb') {
    return (
      <model-viewer
        src={animation_url}
        ar
        ar-modes="webxr scene-viewer quick-look"
        // environment-image="https://modelviewer.dev/shared-assets/environments/moon_1k.hdr"
        poster={tokenImage}
        seamless-poster
        shadow-intensity="1"
        camera-controls
        enable-pan
      ></model-viewer>
    )
  }

  // HTML
  if (
    extension === 'html' ||
    extension === undefined ||
    extension === 'other'
  ) {
    return (
      <iframe
        className="mb-6 aspect-square w-full"
        height="533"
        width="533"
        src={animation_url}
        sandbox="allow-scripts"
      ></iframe>
    )
  }

  return null
}
