#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <https://your-domain>" >&2
  exit 1
fi

url="$1"
headers=$(curl -sSI "$url")

required_headers=(
  "content-security-policy"
  "x-content-type-options"
  "x-frame-options"
  "referrer-policy"
  "permissions-policy"
)

optional_headers=(
  "strict-transport-security"
)

echo "Security header check for: $url"
echo

echo "$headers"
echo

missing_count=0

for header_name in "${required_headers[@]}"; do
  if ! echo "$headers" | grep -iq "^${header_name}:"; then
    echo "Missing required header: ${header_name}" >&2
    missing_count=$((missing_count + 1))
  fi
done

for header_name in "${optional_headers[@]}"; do
  if ! echo "$headers" | grep -iq "^${header_name}:"; then
    echo "Missing recommended header: ${header_name}" >&2
  fi
done

if [ "$missing_count" -gt 0 ]; then
  exit 1
fi

echo "All required security headers are present."
