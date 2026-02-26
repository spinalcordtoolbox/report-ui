import { useCallback, useState } from 'react'

import Table from '@/components/Table'
import { ImportExport } from '@/components/ImportExport'

import { useTableState } from '@/lib/hooks/useTableState'
import { useDatasetSources } from '@/lib/hooks/useDatasetSources'

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
  onSetDisplaySctVersion: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
}

function Datasets({
  onToggleImageFit,
  onToggleShowOverlay,
  onSetBackgroundImage,
  onSetOverlayImage,
  onSetDisplayCmdLine,
  onSetDisplaySctVersion,
}: PropTypes) {
  const [datasets, setDatasets] = useDatasetSources()

  const {
    isLoading: isTableLoading,
    tableState,
    setTableState,
  } = useTableState()

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

  return (
    <>
      <Table
        datasets={datasets}
        onChangeDatasets={setDatasets}
        selectedId={selected?.id}
        tableState={tableState}
        onChangeTableState={setTableState}
        onSelectRow={handleSelectRow}
        onToggleImageFit={onToggleImageFit}
        onToggleShowOverlay={onToggleShowOverlay}
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
