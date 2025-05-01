if (import.meta.env.MODE === 'development') {
  const sampleDataset = import.meta.env.VITE_SAMPLE_DATASETS || 'default'
  console.dir(sampleDataset)
  await import(`../../sample/${sampleDataset}/js/datasets.js` as any)
}
