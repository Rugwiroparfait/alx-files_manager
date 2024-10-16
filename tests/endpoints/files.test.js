import request from 'supertest';
import app from '../app';

describe('File Endpoints', () => {
    it('POST /files should upload a file', async () => {
        const res = await request(app)
            .post('/files')
            .set('x-token', 'your_token_here') // replace with a valid token
            .send({
                name: 'test.txt',
                type: 'file',
                data: 'base64encodeddata',
            });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
    });

    it('GET /files/:id should return a specific file', async () => {
        const res = await request(app).get('/files/some_id_here'); // replace with a valid file id
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('name');
    });

});

