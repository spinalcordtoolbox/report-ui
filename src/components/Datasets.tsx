import { useCallback, useRef, useState } from 'react'

import Table from '@/components/Table'
import { ImportExport } from '@/components/ImportExport'

import { useTableState } from '@/lib/hooks/useTableState'
import { useDatasetSources } from '@/lib/hooks/useDatasetSources'
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts'

export interface Dataset {
  id: string
  path: string
  cmdline: string
  command: string
  sctVersion: string
  dataset: string
  subject: string
  contrast: string
  inputFile: string
  plane: string
  backgroundImage: string
  overlayImage: string
  date: string
  rank: number | null
  qc: string
}

interface PropTypes {
  onToggleImageFit: () => void
  onToggleShowOverlay: () => void
  onSetBackgroundImage: React.Dispatch<React.SetStateAction<string>>
  onSetOverlayImage: React.Dispatch<React.SetStateAction<string>>
  onSetDisplayCmdLine: React.Dispatch<React.SetStateAction<string | undefined>>
  onSetDisplaySctVersion: React.Dispatch<React.SetStateAction<string | undefined>>
}

function Datasets({
  onToggleImageFit,
  onToggleShowOverlay,
  onSetBackgroundImage,
  onSetOverlayImage,
  onSetDisplayCmdLine,
  onSetDisplaySctVersion
}: PropTypes) {
  const [datasets, setDatasets] = useDatasetSources()

  const {
    isLoading: isTableLoading,
    tableState,
    setTableState,
  } = useTableState()

  // freeze order when modifying data to prevent losing one's place on the list
  const changeDatasets = useCallback((replaceDatasets: Dataset[]) => {
    setTableState({ sorting: [{ id: 'position', desc: false }] })

    setDatasets(replaceDatasets)
  }, [])

  const [selected, setSelected] = useState<Dataset>()

  const handleSelectRow = useCallback(
    (id: string) => {
      const dataset = datasets.find((r) => r.id == id)
      setSelected(dataset)
      onSetBackgroundImage(dataset?.backgroundImage ?? '')
      onSetOverlayImage(dataset?.overlayImage ?? '')
      onSetDisplayCmdLine(dataset?.cmdline)
      onSetDisplaySctVersion(dataset?.sctVersion)
    },
    [datasets],
  )

  const tbodyRef = useRef<HTMLTableSectionElement>(null)

  const searchRef = useRef<HTMLInputElement>(null)

  const focusSearch = useCallback(() => {
    if (!searchRef.current) {
      return
    }

    searchRef.current.focus()
  }, [searchRef.current])

  useKeyboardShortcuts(
    datasets,
    changeDatasets,
    tbodyRef,
    onToggleImageFit,
    onToggleShowOverlay,
    selected,
    handleSelectRow,
    focusSearch,
  )

  return (
    <>
      <Table
        ref={tbodyRef}
        datasets={datasets}
        selectedId={selected?.id}
        tableState={tableState}
        onChangeTableState={setTableState}
        onSelectRow={handleSelectRow}
        searchRef={searchRef}
        isLoading={isTableLoading}
      />
      <ImportExport
        datasets={datasets}
        tableState={tableState}
        onSetDatasets={setDatasets}
        onSetTableState={setTableState}
      />
    </>
  )
}

export default Datasets
