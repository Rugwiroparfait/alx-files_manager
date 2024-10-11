import dbClient from './utils/db';

const waitConnection = () => {
  return new Promise((resolve, reject) => {
    let i = 0;
    const repeatFct = async () => {
      await setTimeout(() => {
        i += 1;
        if (i >= 10) {
          reject();
        } else if (!dbClient.isAlive()) {
          repeatFct();
        } else {
          resolve();
        }
      }, 1000);
    };
    repeatFct();
  });
};

(async () => {
  console.log(dbClient.isAlive()); // Initial check for the connection
  await waitConnection(); // Wait for the connection to establish
  console.log(dbClient.isAlive()); // Should return true if connection is successful
  console.log(await dbClient.nbUsers()); // Returns the number of users
  console.log(await dbClient.nbFiles()); // Returns the number of files
})();

