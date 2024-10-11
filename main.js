// main.js
import redisClient from './utils/redis';

(async () => {
    console.log(redisClient.isAlive());          // Check if Redis is alive
    console.log(await redisClient.get('myKey')); // Should return null if not set

    await redisClient.set('myKey', 12, 5);       // Set a key with value 12 and expiration of 5 seconds
    console.log(await redisClient.get('myKey')); // Should return 12

    // Wait for 10 seconds and check if the key expired
    setTimeout(async () => {
        console.log(await redisClient.get('myKey')); // Should return null (expired)
    }, 1000 * 10);
})();
