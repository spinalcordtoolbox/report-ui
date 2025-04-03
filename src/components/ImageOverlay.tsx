import { useEffect, useMemo, useState } from 'react'
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

export interface PropTypes {
  backgroundImage: string
  overlayImage: string
  showOverlay: boolean
}

export function ImageOverlay({
  className,
  backgroundImage,
  overlayImage,
  showOverlay,
}: PropTypes & {
  className: string
}) {
  /*
   * Do some imperative trickery to try to synchronize gifs.
   * If this doesn't work, we could try splitting the frames with
   * https://www.npmjs.com/package/gif-frames
   * and using window.requestAnimationFrame to render them simultaneously
   */
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const bgCleanedPath = useMemo(
    () => (backgroundImage ? backgroundImage.replace(/^\//g, '') : ''),
    [backgroundImage],
  )
  const overlayCleanedPath = useMemo(
    () => (overlayImage ? overlayImage.replace(/^\//g, '') : ''),
    [overlayImage],
  )

  useEffect(() => {
    if (!bgCleanedPath && !overlayCleanedPath) return
    // sync doesn't matter, just render
    if (
      !bgCleanedPath.endsWith('.gif') &&
      !overlayCleanedPath.endsWith('.gif')
    ) {
      setImagesLoaded(true)
      return
    }

    setImagesLoaded(false)

    let isCancelled = false

    Promise.all([
      preloadImage(bgCleanedPath),
      preloadImage(overlayCleanedPath),
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
  }, [bgCleanedPath, overlayCleanedPath])

  return (
    <div className={classNames(className, 'relative min-h-0')}>
      {imagesLoaded ? (
        <img className="w-full h-full object-contain" src={bgCleanedPath} />
      ) : null}
      {imagesLoaded ? (
        <img
          className={classNames(
            'absolute h-full w-full top-0 left-0 object-contain transition-opacity duration-50',
            showOverlay ? 'opacity-100' : 'opacity-0',
          )}
          src={overlayCleanedPath}
        />
      ) : null}
    </div>
  )
}
