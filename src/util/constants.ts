import {v4 as uuidv4} from 'uuid';

import { Dataset } from '@/App'

/* We need to load these dynamically as the window object can get populated between
  declaration and mounting */
export const getConstants = () => {
  // ugly way to convince Typescript to accept our hacky globals
  const window_ = window as any

  // inject uuid for old reports to avoid concurrency issues
  if (!window_.SCT_QC_UUID) {
    console.warn("No UUID found for this report. Persisting across sessions will not work.")
    window_.SCT_QC_UUID = uuidv4()
  }

  const LOCAL_STORAGE_UUID = window_.SCT_QC_UUID as string
  const INITIAL_DATASETS = window_.SCT_QC_DATASETS as Array<Dataset>
  const DATASETS_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_UUID}-sct-qc-report_datasets`
  const TABLE_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_UUID}-sct-qc-reports_table`

  // only for use in dev
  const DATASETS_PATH_PREFIX = import.meta.env.VITE_SAMPLE_DATASETS ? `sample/${import.meta.env.VITE_SAMPLE_DATASETS}`  : ''

  return {
    INITIAL_DATASETS,
    LOCAL_STORAGE_UUID,
    DATASETS_LOCAL_STORAGE_KEY,
    TABLE_LOCAL_STORAGE_KEY,
    DATASETS_PATH_PREFIX,
  }
}
