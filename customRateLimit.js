class RateLimiter {
  constructor(options) {
    this.maxRequests = options.maxRequests || 5; // Maximum requests allowed
    this.windowMs = options.windowMs || 15 * 60 * 1000; // Time window in milliseconds
    this.blockDurationMs = options.blockDurationMs || 60 * 60 * 1000; // Block duration in milliseconds
    this.store = {}; // In-memory store to track user requests
  }

  // Method to handle requests
  handleRequest(ip) {
    const currentTime = Date.now();

    // Check if the user is already blocked
    if (this.store[ip] && this.store[ip].blockedUntil > currentTime) {
      return { success: false, message: "You are blocked. Try again later." };
    }

    // Initialize the user's request history if not present
    if (!this.store[ip]) {
      this.store[ip] = { requests: 0, firstRequestTime: currentTime };
    }

    const userData = this.store[ip];

    // Reset the request count if the window has passed
    if (currentTime - userData.firstRequestTime > this.windowMs) {
      userData.requests = 0;
      userData.firstRequestTime = currentTime;
    }

    // Increment the request count
    userData.requests += 1;

    // If requests exceed the max allowed, block the user
    if (userData.requests > this.maxRequests) {
      userData.blockedUntil = currentTime + this.blockDurationMs;
      return {
        success: false,
        message: `You have exceeded the limit. You are blocked for ${
          this.blockDurationMs / 1000
        } seconds.`,
      };
    }

    return { success: true, message: "Request successful" };
  }

  // Middleware for Express
  middleware(req, res, next) {
    const ip = req.ip;
    const result = this.handleRequest(ip);

    if (!result.success) {
      return res.status(429).json({ error: result.message });
    }

    next();
  }
}

module.exports = RateLimiter;
