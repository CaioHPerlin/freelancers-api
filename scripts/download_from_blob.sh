#!/bin/bash

OUTPUT="./uploads/"

if [ ! -d "$OUTPUT" ]; then
  mkdir -p "$OUTPUT"
fi

API_URL="https://sebrae-api.vercel.app/freelancers"
BASE_URL="https://ub7txpxyf1bghrmk.public.blob.vercel-storage.com"

echo "Fetching data..."
USER_DATA=$(curl -s $API_URL)
USER_IDS=$(echo $USER_DATA | jq -r '.[].cpf')

for USER_ID in $USER_IDS; do
    PFP_URL="${BASE_URL}/pfp_${USER_ID}.jpeg"
    FCP_URL="${BASE_URL}/fcp_${USER_ID}.jpeg"

    echo "Downloading pfp_${USER_ID}.jpeg..."
    curl -s $PFP_URL -o "${OUTPUT}pfp_${USER_ID}.jpeg"

    echo "Downloading fcp_${USER_ID}.jpeg..."
    curl -s $FCP_URL -o "${OUTPUT}fcp_${USER_ID}.jpeg"
done

echo "Success!"