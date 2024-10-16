import redisClient from '../utils/redis';
import { expect } from 'chai';

describe('Redis Client', () => {
    it('should connect to Redis', async () => {
        const result = await redisClient.ping();
        expect(result).to.equal('PONG');
    });
    // Add more tests for redisClient functions
});

