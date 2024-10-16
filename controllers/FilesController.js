import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import fs from 'fs';
import path from 'path';

class FilesController {
    static async postUpload(req, res) {
        const token = req.headers['x-token'];

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = `auth_${token}`;
        const userId = await redisClient.get(key);

        // Check if the user exists in Redis
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, type, parentId = 0, isPublic = false, data } = req.body;

        // Validate name and type
        if (!name) return res.status(400).json({ error: 'Missing name' });
        if (!['folder', 'file', 'image'].includes(type)) {
            return res.status(400).json({ error: 'Missing type' });
        }
        if (type !== 'folder' && !data) {
            return res.status(400).json({ error: 'Missing data' });
        }

        // Validate parentId
        if (parentId !== 0) {
            const parentFile = await dbClient.db.collection('files').findOne({ _id: parentId });
            if (!parentFile) {
                return res.status(400).json({ error: 'Parent not found' });
            }
            if (parentFile.type !== 'folder') {
                return res.status(400).json({ error: 'Parent is not a folder' });
            }
        }

        const fileDocument = {
            userId,
            name,
            type,
            isPublic,
            parentId,
        };

        if (type === 'folder') {
            const result = await dbClient.db.collection('files').insertOne(fileDocument);
            return res.status(201).json(result.ops[0]);
        }

        // Define folder path for file storage
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Generate file path and store file content
        const fileId = uuidv4();
        const filePath = path.join(folderPath, fileId);

        // Store the file content
        const buffer = Buffer.from(data, 'base64');
        fs.writeFileSync(filePath, buffer);

        // Add file details to DB
        fileDocument.localPath = filePath;
        const result = await dbClient.db.collection('files').insertOne(fileDocument);

        return res.status(201).json(result.ops[0]);
    }
     static async getShow(req, res) {
        const { id } = req.params;
        const token = req.headers['x-token'];

        try {
            // Get user ID from Redis based on token
            const userId = await redisClient.get(`auth_${token}`);
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            // Fetch file by ID and check if it belongs to the user
            const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(id), userId });
            if (!file) return res.status(404).json({ error: 'Not found' });

            return res.status(200).json({
                id: file._id,
                userId: file.userId,
                name: file.name,
                type: file.type,
                isPublic: file.isPublic,
                parentId: file.parentId,
            });
        } catch (error) {
            console.error('Error in getShow:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // List all files for the user, with optional parentId and pagination
    static async getIndex(req, res) {
        const token = req.headers['x-token'];
        const { parentId = 0, page = 0 } = req.query;
        const ITEMS_PER_PAGE = 20;
        const skip = parseInt(page, 10) * ITEMS_PER_PAGE;

        try {
            // Get user ID from Redis based on token
            const userId = await redisClient.get(`auth_${token}`);
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            // Find files based on user and parentId, apply pagination
            const query = { userId, parentId };
            const files = await dbClient.db.collection('files')
                .find(query)
                .skip(skip)
                .limit(ITEMS_PER_PAGE)
                .toArray();

            const result = files.map(file => ({
                id: file._id,
                userId: file.userId,
                name: file.name,
                type: file.type,
                isPublic: file.isPublic,
                parentId: file.parentId,
            }));

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in getIndex:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
     // PUT /files/:id/publish
  static async putPublish(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    
    // Retrieve the user based on the token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const db = dbClient.getDb();
    const file = await db.collection('files').findOne({ _id: ObjectId(id), userId });
    
    // If no file document is linked to the user and the ID, return a 404
    if (!file) return res.status(404).json({ error: 'Not found' });
    
    // Update the value of isPublic to true
    await db.collection('files').updateOne({ _id: ObjectId(id) }, { $set: { isPublic: true } });
    
    // Return the updated file document
    const updatedFile = await db.collection('files').findOne({ _id: ObjectId(id) });
    return res.status(200).json(updatedFile);
  }

  // PUT /files/:id/unpublish
  static async putUnpublish(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    
    // Retrieve the user based on the token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const db = dbClient.getDb();
    const file = await db.collection('files').findOne({ _id: ObjectId(id), userId });
    
    // If no file document is linked to the user and the ID, return a 404
    if (!file) return res.status(404).json({ error: 'Not found' });
    
    // Update the value of isPublic to false
    await db.collection('files').updateOne({ _id: ObjectId(id) }, { $set: { isPublic: false } });
    
    // Return the updated file document
    const updatedFile = await db.collection('files').findOne({ _id: ObjectId(id) });
    return res.status(200).json(updatedFile);
  }
}

export default FilesController;

