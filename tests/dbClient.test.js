import dbClient from '../utils/db';
import { expect } from 'chai';

describe('Database Client', () => {
    it('should connect to the database', async () => {
        const client = await dbClient.connect();
        expect(client).to.be.an('object');
        await dbClient.close();
    });
    // Add more tests for dbClient functions
});

