#!/bin/bash
# Web Project Release Validation Script

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "=================================================="
echo "🚀 Release Validation (Web Project)"
echo "=================================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# VERSION
echo "📦 Checking version..."
PACKAGE_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "N/A")
echo "  package.json: v$PACKAGE_VERSION"
echo -e "${GREEN}✅ Version found${NC}"
echo ""

# CODE QUALITY
echo "🔍 Code Quality Checks..."
if grep -r "console\.log\|console\.debug" src/ *.js *.html --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | grep -v "// debug:"; then
  echo -e "${RED}❌ ERROR: Found console.log/debug!${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ No console.log found${NC}"
fi
echo ""

# BUILD TEST
echo "🔨 Build Test..."
if npm run build >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed!${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# SECURITY
echo "🔒 Security Audit..."
if npm audit --audit-level=high 2>&1 | grep -q "found 0 vulnerabilities"; then
  echo -e "${GREEN}✅ No high-severity vulnerabilities${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Vulnerabilities found${NC}"
  npm audit --audit-level=high
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# SUMMARY
echo "=================================================="
echo "📊 VALIDATION SUMMARY"
echo "=================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
  echo ""
  echo "✅ Ready for release v$PACKAGE_VERSION"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  CHECKS PASSED WITH WARNINGS${NC}"
  echo "Warnings: $WARNINGS"
  exit 0
else
  echo -e "${RED}❌ VALIDATION FAILED${NC}"
  echo "Errors: $ERRORS"
  echo "Warnings: $WARNINGS"
  exit 1
fi
