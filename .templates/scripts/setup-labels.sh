#!/bin/bash
# Setup standardized labels for GitHub repository
# Usage: ./setup-labels.sh <owner/repo>
# Example: ./setup-labels.sh S540d/Eisenhauer

set -e

REPO="${1:?Repo required: owner/repo}"

echo "Setting up labels for $REPO..."

# Helper function to create/update label
create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  echo "Creating label: $name"
  gh label create "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description" \
    2>/dev/null || gh label edit "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description"
}

# Type Labels
create_label "bug" "d73a4a" "Fehler / Bug"
create_label "feature" "a2eeef" "Neues Feature"
create_label "enhancement" "7057ff" "Verbesserung / Erweiterung"
create_label "docs" "0075ca" "Dokumentation"

# Priority Labels
create_label "priority: high" "d4873e" "Wichtig - sollte bald bearbeitet werden"
create_label "priority: low" "5fde5d" "Kann warten"

# Status Labels
create_label "blocked" "3d3d3d" "Blockiert - wartet auf etwas"
create_label "ready-for-implementation" "34b13e" "Ready - kann angefangen werden"

# Delete GitHub default labels (optional)
echo ""
echo "Removing GitHub default labels..."
gh label delete "duplicate" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "good first issue" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "help wanted" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "invalid" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "question" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "wontfix" --repo "$REPO" --yes 2>/dev/null || true

# Delete old custom labels (if any)
gh label delete "Prio" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "prio" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "high-priority" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "ui/ux" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "design" --repo "$REPO" --yes 2>/dev/null || true

echo ""
echo "✅ Labels setup complete for $REPO!"
gh label list --repo "$REPO"
