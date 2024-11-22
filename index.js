const RateLimiter = require("./customRateLimit");

// This is basic concept of create custom rate limiter

// Create a rate limiter instance
const rateLimiter = new RateLimiter({
  maxRequests: 10, // Max requests allowed in the window
  windowMs: 15 * 60 * 1000, // 15 minutes window
  blockDurationMs: 5 * 60 * 1000, // Block for 5 minutes after exceeding limit
});

//Just concept
// Use the rate limiter as a middleware
// app.use((req, res, next) => rateLimiter.middleware(req, res, next));
