// utils/redis.js
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    // Handle error
    this.client.on('error', (err) => {
      console.error('Redis client not connected to the server:', err);
    });

    // Log connection success
    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });

    // Connect the client
    this.client.connect().catch((err) => console.error('Redis connection error:', err));
  }

  // Check if Redis client is alive
  isAlive() {
    return this.client.isOpen;
  }

  // Get the value for a given key
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error('Error getting key:', err);
      throw err;
    }
  }

  // Set a key-value pair with an expiration time in seconds
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, { EX: duration });
    } catch (err) {
      console.error('Error setting key:', err);
      throw err;
    }
  }

  // Delete a key
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Error deleting key:', err);
      throw err;
    }
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

