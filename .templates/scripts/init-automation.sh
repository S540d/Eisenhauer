#!/bin/bash

# ==============================================================================
# 🤖 Automated Quality System Initializer
# ==============================================================================
# Setzt automatische Quality Assurance für neue Projekte auf
# Usage: ./init-automation.sh [project-path]
# ==============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TEMPLATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_DIR="${1:-.}"

echo -e "${BLUE}=================================================="
echo "🤖 Automated Quality System Initializer"
echo -e "==================================================${NC}"
echo ""

if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}❌ ERROR: Project directory not found: $PROJECT_DIR${NC}"
  exit 1
fi

cd "$PROJECT_DIR"
PROJECT_NAME=$(basename "$(pwd)")

echo -e "${BLUE}📁 Project:${NC} $PROJECT_NAME"
echo -e "${BLUE}📍 Path:${NC} $(pwd)"
echo ""

# ==============================================================================
# 1. DETECT PROJECT TYPE
# ==============================================================================
echo -e "${BLUE}🔍 Detecting project type...${NC}"

PROJECT_TYPE="unknown"
IS_REACT_NATIVE=false
IS_WEB=false
IS_ANDROID=false

if [ -f "package.json" ]; then
  if grep -q "react-native" package.json || grep -q "expo" package.json; then
    PROJECT_TYPE="react-native"
    IS_REACT_NATIVE=true
    echo -e "${GREEN}  ✅ React Native/Expo project detected${NC}"
  elif grep -q "react" package.json; then
    PROJECT_TYPE="web"
    IS_WEB=true
    echo -e "${GREEN}  ✅ Web/React project detected${NC}"
  else
    PROJECT_TYPE="node"
    echo -e "${GREEN}  ✅ Node.js project detected${NC}"
  fi
fi

if [ -d "Android" ] || [ -d "android" ]; then
  IS_ANDROID=true
  echo -e "${GREEN}  ✅ Android native code detected${NC}"
fi

echo ""

# ==============================================================================
# 2. COPY AUTOMATION FILES
# ==============================================================================
echo -e "${BLUE}📋 Copying automation files...${NC}"

# GitHub Actions Workflow
mkdir -p .github/workflows
if [ "$IS_REACT_NATIVE" = true ]; then
  echo -e "${YELLOW}  → Copying React Native CI/CD workflow${NC}"
  cp "$TEMPLATE_DIR/automation-templates/ci-cd-react-native.yml" .github/workflows/ci-cd.yml
elif [ "$IS_WEB" = true ]; then
  echo -e "${YELLOW}  → Copying Web CI/CD workflow${NC}"
  cp "$TEMPLATE_DIR/automation-templates/ci-cd-web.yml" .github/workflows/ci-cd.yml
else
  echo -e "${YELLOW}  → Copying generic CI/CD workflow${NC}"
  cp "$TEMPLATE_DIR/automation-templates/ci-cd-generic.yml" .github/workflows/ci-cd.yml
fi
echo -e "${GREEN}  ✅ .github/workflows/ci-cd.yml${NC}"

# PR Template
cp "$TEMPLATE_DIR/automation-templates/PULL_REQUEST_TEMPLATE.md" .github/
echo -e "${GREEN}  ✅ .github/PULL_REQUEST_TEMPLATE.md${NC}"

# Pre-commit hooks
mkdir -p .husky
if [ "$IS_REACT_NATIVE" = true ]; then
  cp "$TEMPLATE_DIR/automation-templates/pre-commit-react-native" .husky/pre-commit
else
  cp "$TEMPLATE_DIR/automation-templates/pre-commit-generic" .husky/pre-commit
fi
chmod +x .husky/pre-commit
echo -e "${GREEN}  ✅ .husky/pre-commit${NC}"

# Validation script
mkdir -p scripts
if [ "$IS_REACT_NATIVE" = true ]; then
  cp "$TEMPLATE_DIR/automation-templates/validate-release-react-native.sh" scripts/validate-release.sh
elif [ "$IS_WEB" = true ]; then
  cp "$TEMPLATE_DIR/automation-templates/validate-release-web.sh" scripts/validate-release.sh
else
  cp "$TEMPLATE_DIR/automation-templates/validate-release-generic.sh" scripts/validate-release.sh
fi
chmod +x scripts/validate-release.sh
echo -e "${GREEN}  ✅ scripts/validate-release.sh${NC}"

# ESLint config
if [ -f "package.json" ]; then
  cp "$TEMPLATE_DIR/automation-templates/.eslintrc.js" .
  echo -e "${GREEN}  ✅ .eslintrc.js${NC}"
fi

# Platform utilities (React Native only)
if [ "$IS_REACT_NATIVE" = true ]; then
  mkdir -p utils
  cp "$TEMPLATE_DIR/automation-templates/platform.ts" utils/
  echo -e "${GREEN}  ✅ utils/platform.ts${NC}"
fi

# Documentation
cp "$TEMPLATE_DIR/automation-templates/AUTOMATION_SETUP.md" .
echo -e "${GREEN}  ✅ AUTOMATION_SETUP.md${NC}"

cp "$TEMPLATE_DIR/automation-templates/RELEASE_CHECKLIST.md" .
echo -e "${GREEN}  ✅ RELEASE_CHECKLIST.md${NC}"

echo ""

# ==============================================================================
# 3. UPDATE package.json
# ==============================================================================
if [ -f "package.json" ]; then
  echo -e "${BLUE}📦 Updating package.json...${NC}"

  # Add scripts
  if ! grep -q '"validate"' package.json; then
    echo -e "${YELLOW}  → Adding 'validate' script${NC}"
    # Note: In production, use jq or similar for JSON manipulation
    echo -e "${YELLOW}  ⚠️  Please add this to package.json scripts manually:${NC}"
    echo '    "validate": "./scripts/validate-release.sh",'
    echo '    "prepare": "husky install"'
  fi

  # Add Husky dependency
  if ! grep -q '"husky"' package.json; then
    echo -e "${YELLOW}  → Adding Husky to devDependencies${NC}"
    npm install --save-dev husky
    echo -e "${GREEN}  ✅ Husky installed${NC}"
  else
    echo -e "${GREEN}  ✅ Husky already in dependencies${NC}"
  fi

  echo ""
fi

# ==============================================================================
# 4. GIT SETUP
# ==============================================================================
if [ -d ".git" ]; then
  echo -e "${BLUE}🔀 Setting up Git hooks...${NC}"
  npx husky install 2>/dev/null || true
  echo -e "${GREEN}  ✅ Git hooks installed${NC}"
  echo ""
fi

# ==============================================================================
# 5. SUMMARY & NEXT STEPS
# ==============================================================================
echo -e "${GREEN}=================================================="
echo "✅ AUTOMATION SETUP COMPLETE!"
echo -e "==================================================${NC}"
echo ""
echo -e "${BLUE}📋 What was set up:${NC}"
echo "  ✅ GitHub Actions CI/CD pipeline"
echo "  ✅ Pre-commit hooks for local validation"
echo "  ✅ Release validation script"
echo "  ✅ ESLint configuration"
if [ "$IS_REACT_NATIVE" = true ]; then
  echo "  ✅ Platform safety utilities"
fi
echo "  ✅ Documentation files"
echo ""

echo -e "${BLUE}🚀 Next steps:${NC}"
echo ""
echo "  1. Review and customize generated files:"
echo "     - .github/workflows/ci-cd.yml"
echo "     - .husky/pre-commit"
echo "     - scripts/validate-release.sh"
echo ""
echo "  2. Add missing package.json scripts (if needed):"
echo "     - \"validate\": \"./scripts/validate-release.sh\""
echo "     - \"prepare\": \"husky install\""
echo ""
echo "  3. Test the setup:"
echo "     - npm run validate"
echo "     - git add . && git commit -m \"test: automation\""
echo ""
echo "  4. Push to GitHub to activate CI/CD:"
echo "     - git push origin main"
echo ""
echo "  5. Read documentation:"
echo "     - AUTOMATION_SETUP.md"
echo "     - RELEASE_CHECKLIST.md"
echo ""

echo -e "${GREEN}🎉 Your project now has automated quality assurance!${NC}"
echo ""

# ==============================================================================
# 6. COMPATIBILITY CHECK
# ==============================================================================
echo -e "${BLUE}🔍 Running compatibility check...${NC}"
./scripts/validate-release.sh 2>&1 | head -50 || echo -e "${YELLOW}⚠️  Initial validation failed - this is normal for new setup${NC}"
echo ""

echo -e "${BLUE}For questions, see:${NC} AUTOMATION_SETUP.md"
