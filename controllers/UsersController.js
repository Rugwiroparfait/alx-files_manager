import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        try {
            const db = dbClient.getDb(); // Use the getDb method to retrieve the db instance
            
            // Check if the user already exists
            const existingUser = await db.collection('users').findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Already exists' });
            }

            // Hash the password using SHA1
            const hashedPassword = sha1(password);

            // Insert new user into the database
            const newUser = {
                email,
                password: hashedPassword,
            };
            const result = await db.collection('users').insertOne(newUser);

            // Return the newly created user with id and email only
            return res.status(201).json({ id: result.insertedId, email });
        } catch (error) {
            // Handle any errors that occur during database operations
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default UsersController;

