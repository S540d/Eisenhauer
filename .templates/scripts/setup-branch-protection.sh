#!/bin/bash
# Setup Branch Protection Rules for a GitHub Repository
# Usage: ./setup-branch-protection.sh PROJECT_NAME [PROJECT_TYPE]
#   PROJECT_TYPE: "react-native" or "web" (default: auto-detect)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo -e "${RED}❌ ERROR: GitHub CLI (gh) is not installed${NC}"
  echo "Install it from: https://cli.github.com/"
  exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
  echo -e "${RED}❌ ERROR: Not authenticated with GitHub CLI${NC}"
  echo "Run: gh auth login"
  exit 1
fi

# Parse arguments
PROJECT_NAME=$1
PROJECT_TYPE=$2

if [ -z "$PROJECT_NAME" ]; then
  echo -e "${RED}❌ ERROR: Project name is required${NC}"
  echo "Usage: $0 PROJECT_NAME [PROJECT_TYPE]"
  echo "Example: $0 1x1_Trainer react-native"
  exit 1
fi

# Auto-detect project type if not provided
if [ -z "$PROJECT_TYPE" ]; then
  echo -e "${BLUE}🔍 Auto-detecting project type...${NC}"

  # Check if project has React Native files
  if gh api repos/S540d/$PROJECT_NAME/contents/app.json &> /dev/null; then
    PROJECT_TYPE="react-native"
    echo -e "${GREEN}✅ Detected: React Native project${NC}"
  else
    PROJECT_TYPE="web"
    echo -e "${GREEN}✅ Detected: Web project${NC}"
  fi
fi

# Select ruleset file
if [ "$PROJECT_TYPE" = "react-native" ]; then
  RULESET_FILE="$TEMPLATES_DIR/github-ruleset-protect-main-react-native.json"
else
  RULESET_FILE="$TEMPLATES_DIR/github-ruleset-protect-main-web.json"
fi

if [ ! -f "$RULESET_FILE" ]; then
  echo -e "${RED}❌ ERROR: Ruleset file not found: $RULESET_FILE${NC}"
  exit 1
fi

echo ""
echo "=========================================="
echo "🔒 Setting up Branch Protection"
echo "=========================================="
echo ""
echo "Repository: S540d/$PROJECT_NAME"
echo "Project Type: $PROJECT_TYPE"
echo "Ruleset File: $(basename $RULESET_FILE)"
echo ""

# Show what will be protected
echo -e "${YELLOW}📋 Rules to be applied:${NC}"
echo "  • Branch: main"
echo "  • Required checks: code-quality, build-web"
if [ "$PROJECT_TYPE" = "react-native" ]; then
  echo "  • (Android builds optional)"
fi
echo "  • Block force pushes: yes"
echo "  • Required approvals: 0 (bypass for admins)"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}⚠️  Cancelled${NC}"
  exit 0
fi

echo ""
echo -e "${BLUE}🚀 Creating ruleset...${NC}"

# Create the ruleset
RESPONSE=$(gh api repos/S540d/$PROJECT_NAME/rulesets \
  --method POST \
  --input "$RULESET_FILE" 2>&1) || {
  echo -e "${RED}❌ ERROR: Failed to create ruleset${NC}"
  echo "$RESPONSE"

  # Check if ruleset already exists
  if echo "$RESPONSE" | grep -q "already exists"; then
    echo ""
    echo -e "${YELLOW}⚠️  A ruleset with this name already exists${NC}"
    echo ""
    echo "Options:"
    echo "1. Delete the existing ruleset via GitHub UI:"
    echo "   https://github.com/S540d/$PROJECT_NAME/settings/rules"
    echo "2. Or update it manually with the new rules"
    exit 1
  fi

  exit 1
}

echo -e "${GREEN}✅ Branch protection rules created successfully!${NC}"
echo ""
echo "View rules at:"
echo "https://github.com/S540d/$PROJECT_NAME/settings/rules"
echo ""
echo -e "${GREEN}🎉 Done!${NC}"
echo ""
echo "Next steps:"
echo "1. Push a commit to trigger CI/CD"
echo "2. Verify status checks appear in the PR"
echo "3. Test by creating a PR to main"
