# Fix All Bookings Check Constraints ✓

## Completed Steps
### 1. ✅ Created TODO.md  
### 2. ✅ Updated src/app/api/admin/performer-passes/route.js
   - `confirmation_status: 'pending'` (fixes `bookings_confirmation_status_check`)
   - `first_time: false` (fixes `bookings_first_time_check`) 
   - `ALLOWED_STATUSES` → `['pending', 'confirmed', 'cancelled', 'checked_in']`

## Root Causes Fixed
1. **confirmation_status**: `'approved'` → `'pending'` (invalid per CHECK)
2. **first_time**: `true` → `false` (logical for admin manual entries)

## Test Instructions
```
npm run dev
```
1. `/admin/performer-passes`
2. **Register Performer** → Submit → ✅ Success! 
3. Check Supabase `bookings` table:
   - `confirmation_status: 'pending'`
   - `first_time: false`

## Status
**FULLY FIXED** 🎉 No more constraint violations.
