#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Part Finder memlog directory...${NC}\n"

# Create required directories
echo "Creating directories..."
mkdir -p temp credentials
echo -e "${GREEN}✓${NC} Directories created\n"

# Check for .env file
echo "Checking environment configuration..."
if [ ! -f "credentials/.env" ]; then
    if [ -f "credentials/.env.template" ]; then
        cp credentials/.env.template credentials/.env
        echo -e "${YELLOW}⚠ Created .env file from template. Please edit credentials/.env with your settings${NC}"
    else
        echo -e "${RED}✗ .env.template not found${NC}"
    fi
else
    echo -e "${GREEN}✓${NC} .env file exists"
fi

# Verify directory structure
echo -e "\nVerifying directory structure..."
REQUIRED_FILES=(
    "README.md"
    "PROJECT_STATE.md"
    "CHANGELOG.md"
    "TASKS.md"
    "temp/README.md"
    "credentials/README.md"
)

ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file is missing"
        ALL_PRESENT=false
    fi
done

# Check git ignore status
echo -e "\nChecking .gitignore configuration..."
if grep -q "memlog/temp/" ../../.gitignore && \
   grep -q "memlog/credentials/" ../../.gitignore && \
   grep -q "memlog/\*.log" ../../.gitignore; then
    echo -e "${GREEN}✓${NC} .gitignore properly configured"
else
    echo -e "${YELLOW}⚠ .gitignore may need updating${NC}"
fi

echo -e "\nSetup complete!"
if [ "$ALL_PRESENT" = true ]; then
    echo -e "${GREEN}All required files are present.${NC}"
else
    echo -e "${YELLOW}Some files are missing. Please check the output above.${NC}"
fi

# Make the script executable
chmod +x setup.sh
