#!/bin/bash

REPORT_PATH=$1

if [[ -z "$REPORT_PATH" ]]; then
  echo "usage: $0 path_to_qc_report_root" >&2
  exit 1
fi

UUID=$(grep -m 1 -oP "(?<=UUID = ')[^']+" "$REPORT_PATH/js/datasets.js")

if [[ -z "$UUID" ]]; then
  echo "No UUID found in $REPORT_PATH/js/datasets.js - is this a ≥v7.0 SCT QC report?" >&2
  exit 1
fi

echo "[+] Report UUID: $UUID"

WORKDIR="sample/$UUID"
echo "[+] Copying to $WORKDIR"

mkdir -p "$WORKDIR"
cp -r "$REPORT_PATH"/* "$WORKDIR/"

echo "Done!"
echo
echo "You can target this dataset in dev by running VITE_SAMPLE_DATASETS=$UUID yarn dev"
echo "or by adding this line to .env.development.local"
echo "VITE_SAMPLE_DATASETS=$UUID"
