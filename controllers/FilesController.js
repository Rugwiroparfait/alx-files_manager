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
}

export default FilesController;

