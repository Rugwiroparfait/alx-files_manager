import { Queue } from 'bull';
import dbClient from './utils/db';
import { promises as fs } from 'fs';
import imageThumbnail from 'image-thumbnail';

// Create the Bull queue
const fileQueue = new Queue('fileQueue');

// Process jobs in the queue
fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  // Find file in database
  const file = await dbClient.getDb().collection('files').findOne({ _id: fileId, userId });
  if (!file) {
    throw new Error('File not found');
  }

  const filePath = `/tmp/files_manager/${file.localPath}`;

  // Generate thumbnails (500, 250, 100)
  try {
    const sizes = [500, 250, 100];
    for (const size of sizes) {
      const thumbnail = await imageThumbnail(filePath, { width: size });
      const thumbnailPath = `${filePath}_${size}`;
      await fs.writeFile(thumbnailPath, thumbnail);
    }
    done();
  } catch (err) {
    done(new Error('Error processing file thumbnails'));
  }
});

