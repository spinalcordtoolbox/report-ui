import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import logoUrl from '@/assets/sct_logo.png'
import Legend from '@/components/Legend'
import Loading from '@/components/Loading'
import ImageDisplay, { FitMode } from '@/ImageDisplay'

import '@/util/devData'
import Datasets from './components/Datasets'

function App() {
  const [backgroundImage, setBackgroundImage] = useState('')
  const [overlayImage, setOverlayImage] = useState('')
  const [showOverlay, setShowOverlay] = useState(true)
  const [displayCmdLine, setDisplayCmdLine] = useState<string>()
  const [displaySctVersion, setDisplaySctVersion] = useState<string>()

  const [loading, setLoading] = useState(false)

  const [imageFitMode, setImageFitMode] = useState<FitMode>('fit')
  const toggleImageFit = useCallback(() => {
    setImageFitMode((f) => (f === 'fit' ? 'full' : 'fit'))
  }, [])

  const toggleShowOverlay = () => setShowOverlay((o) => !o)

  /* Force a render cycle before loading goes away, to force unmounts */
  useEffect(() => {
    if (!loading) {
      return
    }
    setLoading(false)
  }, [loading])

  /* Force unmount of components while loading */
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <nav className="h-12 mr-auto ml-auto px-4 border-b-2 border-gray-200 bg-gray-100 ">
        <div className="flex flex-row flex-nowrap justify-between items-center">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <div className="flex flex-row flex-nowrap items-center">
              <img src={logoUrl} className="h-7" />
              <span className="h-12 p-4 text-lg leading-5">
                SCT - Quality Control
              </span>
            </div>
          </a>
          <a
            href="https://spinalcordtoolbox.com/"
            className="text-sm text-gray-400 hover:text-gray-700"
          >
            SCT Home
          </a>
        </div>
      </nav>
      <div
        className={classNames(
          'h-[calc(100vh_-_--spacing(12))] lg:max-h-[1024px] p-4 max-w-dvw overflow-hidden',
          'flex flex-col flex-nowrap lg:flex-row lg:space-y-0 lg:space-x-4',
        )}
      >
        <div className="flex flex-col space-y-2 w-full lg:w-5/12 h-1/2 lg:h-auto">
          <Legend />
          <Datasets
            onToggleImageFit={toggleImageFit}
            onToggleShowOverlay={toggleShowOverlay}
            onSetBackgroundImage={setBackgroundImage}
            onSetOverlayImage={setOverlayImage}
            onSetDisplayCmdLine={setDisplayCmdLine}
            onSetDisplaySctVersion={setDisplaySctVersion}
          />
        </div>

        <ImageDisplay
          className="w-full lg:w-7/12 h-1/2 lg:h-auto"
          backgroundImage={backgroundImage}
          overlayImage={overlayImage}
          showOverlay={showOverlay}
          cmdLine={displayCmdLine}
          sctVersion={displaySctVersion}
          fitMode={imageFitMode}
          onChangeFitMode={setImageFitMode}
          onToggleShowOverlay={toggleShowOverlay}
        />
      </div>
    </>
  )
}

export default App
