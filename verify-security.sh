#!/bin/bash
# RushXArena Super Admin System — Security Verification Script
# This script validates all security requirements are met

echo "🔒 RushXArena Super Admin Security Verification"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test 1: .env file is gitignored
echo "Test 1: Checking .gitignore for .env files..."
if grep -q "^\.env" .gitignore; then
    echo -e "${GREEN}✓ PASS${NC}: .env files are in .gitignore"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: .env files are NOT in .gitignore"
    ((FAILED++))
fi
echo ""

# Test 2: No .env file exists in repo
echo "Test 2: Checking for uncommitted .env files..."
if [ ! -f ".env" ]; then
    echo -e "${GREEN}✓ PASS${NC}: No .env file found in repository"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: .env file exists (should be in .gitignore)"
    ((FAILED++))
fi
echo ""

# Test 3: .env.example contains only placeholders
echo "Test 3: Checking .env.example for real secrets..."
if ! grep -E "^[A-Za-z_]+=.*@.*\.com|^[A-Za-z_]+=[a-zA-Z0-9]{40,}" .env.example | grep -v "example.com"; then
    echo -e "${GREEN}✓ PASS${NC}: .env.example contains only placeholders"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: .env.example may contain real credentials"
    ((FAILED++))
fi
echo ""

# Test 4: config.js doesn't contain real Supabase keys
echo "Test 4: Checking config.js for placeholder values..."
if grep -q "YOUR_SUPABASE_PROJECT_URL" config.js && grep -q "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY" config.js; then
    echo -e "${GREEN}✓ PASS${NC}: config.js contains only placeholder Supabase credentials"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: config.js may contain real credentials"
    ((FAILED++))
fi
echo ""

# Test 5: No hardcoded passwords in script.js
echo "Test 5: Checking for hardcoded passwords..."
if ! grep -i "password.*=.*['\"]" script.js | grep -v "placeholder\|password_toggle\|Show password\|Hide password" | head -1; then
    echo -e "${GREEN}✓ PASS${NC}: No hardcoded passwords found in script.js"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: Potential hardcoded password found"
    ((FAILED++))
fi
echo ""

# Test 6: Role-based admin function exists
echo "Test 6: Checking for admin authorization in database..."
if grep -q "get_super_admin_email()" supabase-schema.sql && grep -q "if.*role.*super_admin" supabase-schema.sql; then
    echo -e "${GREEN}✓ PASS${NC}: Admin authorization function found in schema"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: Admin authorization function not found"
    ((FAILED++))
fi
echo ""

# Test 7: RLS policies protect profiles table
echo "Test 7: Checking for Row Level Security policies..."
if grep -q "profiles own rows" supabase-schema.sql && grep -q "auth.uid()=id" supabase-schema.sql; then
    echo -e "${GREEN}✓ PASS${NC}: RLS policies found for profiles table"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: RLS policies not found"
    ((FAILED++))
fi
echo ""

# Test 8: Admin route has authorization check
echo "Test 8: Checking for admin route authorization..."
if grep -q 'if(page==="admin"&&state.role!=="super_admin")' script.js; then
    echo -e "${GREEN}✓ PASS${NC}: Admin route authorization check found"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: Admin route authorization check not found"
    ((FAILED++))
fi
echo ""

# Test 9: Admin menu link is conditional
echo "Test 9: Checking for conditional admin menu..."
if grep -q "updateProfileMenu" script.js && grep -q "adminMenuBtn" index.html; then
    echo -e "${GREEN}✓ PASS${NC}: Admin menu is conditionally displayed"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: Admin menu conditional logic not found"
    ((FAILED++))
fi
echo ""

# Test 10: No service-role key in code
echo "Test 10: Checking for service-role key exposure..."
if ! grep -r "service_role\|eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9" . --exclude-dir=.git --include="*.js" --include="*.html" --include="*.json" 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC}: No service-role key found in code"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}: Service-role key may be exposed"
    ((FAILED++))
fi
echo ""

# Summary
echo "=============================================="
echo "Test Summary:"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some security checks failed. Please review above.${NC}"
    exit 1
fi
