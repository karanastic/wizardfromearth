#!/usr/bin/env bash
# Build and publish the site shell to S3, then invalidate CloudFront.
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

python3 build.py

aws s3 cp index.html "s3://$BUCKET/index.html" --content-type "text/html; charset=utf-8" --cache-control "public,max-age=300"
aws s3 cp 404.html "s3://$BUCKET/404.html" --content-type "text/html; charset=utf-8" --cache-control "public,max-age=300"
aws s3 cp sitemap.xml "s3://$BUCKET/sitemap.xml" --content-type "application/xml; charset=utf-8" --cache-control "public,max-age=3600"
aws s3 cp robots.txt "s3://$BUCKET/robots.txt" --content-type "text/plain; charset=utf-8" --cache-control "public,max-age=3600"
aws s3 cp llms.txt "s3://$BUCKET/llms.txt" --content-type "text/plain; charset=utf-8" --cache-control "public,max-age=3600"
if [[ -f wizardfromearth-social-card-2026.png ]]; then
  aws s3 cp wizardfromearth-social-card-2026.png "s3://$BUCKET/wizardfromearth-social-card-2026.png" --content-type "image/png" --cache-control "public,max-age=604800"
fi
aws s3 sync assets "s3://$BUCKET/assets" --delete --exclude '.DS_Store' --cache-control "public,max-age=86400"
aws s3 cp brand/favicon.png "s3://$BUCKET/brand/favicon.png" --content-type "image/png" --cache-control "public,max-age=604800"
aws s3 sync logo "s3://$BUCKET/logo" --delete --exclude '*.psd' --exclude '.DS_Store' --cache-control "public,max-age=604800"
aws s3 sync photos "s3://$BUCKET/photos" --delete --exclude '.DS_Store' --cache-control "public,max-age=604800"
aws s3 sync merch "s3://$BUCKET/merch" --delete --exclude '*.psd' --exclude '.DS_Store' --cache-control "public,max-age=604800"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths '/*' >/dev/null

echo "Site shell deployed. Upload audio separately with ./deploy-media.sh"
