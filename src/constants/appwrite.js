import { Client, Account, Databases} from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_PROJECT_ID); 

const account = new Account(client);
export { ID } from 'appwrite';

const databases = new Databases(client);

export const Appwrite = {
    client: client,
    databases: databases,
    account : account,
    databaseId: import.meta.env.VITE_DATABASE_ID,
    collectionId: import.meta.env.VITE_COLLECTION_ID,
}

