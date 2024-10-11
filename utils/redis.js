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
  }

  // Check if Redis client is alive
  isAlive() {
    return this.client.connected;
  }

  // Get the value for a given key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Set a key-value pair with an expiration time in seconds
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Delete a key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

