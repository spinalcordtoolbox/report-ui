import { useEffect, useState } from 'react'
import classNames from 'classnames'

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function () {
      resolve(img)
    }
    img.onerror = img.onabort = function () {
      reject(src)
    }
    img.src = src
  })
}

export function ImageOverlay({
  backgroundImage,
  overlayImage,
  showOverlay,
}: {
  backgroundImage: string
  overlayImage: string
  showOverlay: boolean
}) {
  /*
   * Do some imperative trickery to try to synchronize gifs.
   * If this doesn't work, we could try splitting the frames with
   * https://www.npmjs.com/package/gif-frames
   * and using window.requestAnimationFrame to render them simultaneously
   */
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    if (!backgroundImage && !overlayImage) return
    // sync doesn't matter, just render
    if (!backgroundImage.endsWith('.gif') && !overlayImage.endsWith('.gif')) {
      setImagesLoaded(true)
      return
    }

    setImagesLoaded(false)

    let isCancelled = false

    Promise.all([
      preloadImage(backgroundImage),
      preloadImage(overlayImage),
    ]).then(() => {
      if (isCancelled) {
        return
      }
      setImagesLoaded(true)
    })

    // when component unmounts, stop don't try to change state
    return () => {
      isCancelled = true
    }
  }, [backgroundImage, overlayImage])

  return (
    <>
      {imagesLoaded ? (
        <img className="w-full h-full object-contain" src={backgroundImage} />
      ) : null}
      {imagesLoaded ? (
        <img
          className={classNames(
            'absolute h-full w-full top-0 left-0 object-contain transition-opacity duration-50',
            showOverlay ? 'opacity-100' : 'opacity-0',
          )}
          src={overlayImage}
        />
      ) : null}
    </>
  )
}
