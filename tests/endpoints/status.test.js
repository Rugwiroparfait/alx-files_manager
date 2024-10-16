import request from 'supertest';
import app from '../app';

describe('GET /status', () => {
    it('should return the status of the API', async () => {
        const res = await request(app).get('/status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'ok');
    });
});

