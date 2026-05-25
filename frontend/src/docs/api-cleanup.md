# API Cleanup Notes

## cartService.removeFromCart
- Currently sends `userId` in the request body
- Backend already has `userId` from `req.user._id` via auth middleware
- Can be simplified later, but left as-is for now per "backend is solid" constraint
