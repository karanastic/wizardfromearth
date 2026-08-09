#!/usr/bin/env bash
# Upload WAV masters and MP3 streaming files without deleting remote audio.
set -euo pipefail

BUCKET="${S3_BUCKET:-wizardfromearth.com}"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
BUCKET="${BUCKET#arn:aws:s3:::}"
BUCKET="${BUCKET#s3://}"
BUCKET="${BUCKET%/}"
DISTRIBUTION_ID="${DISTRIBUTION_ID##*/}"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

command -v aws >/dev/null || { echo "AWS CLI not found."; exit 1; }
[[ -n "$BUCKET" ]] || { echo "S3_BUCKET is required."; exit 1; }
[[ -n "$DISTRIBUTION_ID" ]] || { echo "CLOUDFRONT_DISTRIBUTION_ID is required."; exit 1; }

./prepare-media.sh
aws s3 sync music "s3://$BUCKET/music" --exclude '*' --include '*.mp3' --content-type 'audio/mpeg' --cache-control "public,max-age=604800"
aws s3 sync music "s3://$BUCKET/music" --exclude '*' --include '*.wav' --content-type 'audio/wav' --cache-control "public,max-age=604800"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths '/music/*' >/dev/null

echo "Music archive deployed."
