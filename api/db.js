/**
 * MongoDB Database Connection
 * Conexão com MongoDB Atlas
 */

const { MongoClient } = require('mongodb');

let cachedDb = null;
let cachedClient = null;

/**
 * Conecta ao MongoDB Atlas
 */
async function connectToDatabase() {
    // Se já existe conexão, reutiliza (importante para serverless!)
    if (cachedDb && cachedClient) {
        console.log('♻️  Reutilizando conexão MongoDB existente');
        return { db: cachedDb, client: cachedClient };
    }

    // URL de conexão do MongoDB (vem das variáveis de ambiente)
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        throw new Error('❌ MONGODB_URI não configurado! Adicione nas variáveis de ambiente do Vercel.');
    }

    console.log('🔌 Conectando ao MongoDB Atlas...');

    // Cria novo cliente
    const client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 60000,
    });

    try {
        // Conecta
        await client.connect();
        console.log('✅ Conectado ao MongoDB Atlas!');

        // Pega o banco de dados
        const db = client.db('novoamanhecer'); // Nome do banco

        // Armazena em cache
        cachedDb = db;
        cachedClient = client;

        return { db, client };
    } catch (error) {
        console.error('❌ Erro ao conectar no MongoDB:', error);
        throw error;
    }
}

/**
 * Pega a coleção de usuários
 */
async function getUsersCollection() {
    const { db } = await connectToDatabase();
    return db.collection('users');
}

/**
 * Busca todos os usuários
 */
async function getAllUsers() {
    const users = await getUsersCollection();
    return await users.find({}).toArray();
}

/**
 * Busca usuário por email
 */
async function getUserByEmail(email) {
    const users = await getUsersCollection();
    return await users.findOne({ email: email.toLowerCase() });
}

/**
 * Busca usuário por ID
 */
async function getUserById(id) {
    const users = await getUsersCollection();
    return await users.findOne({ id: id });
}

/**
 * Cria novo usuário
 */
async function createUser(userData) {
    const users = await getUsersCollection();
    const result = await users.insertOne({
        ...userData,
        email: userData.email.toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return { ...userData, _id: result.insertedId };
}

/**
 * Atualiza usuário
 */
async function updateUser(id, updateData) {
    const users = await getUsersCollection();
    const result = await users.findOneAndUpdate(
        { id: id },
        { 
            $set: {
                ...updateData,
                updatedAt: new Date().toISOString()
            }
        },
        { returnDocument: 'after' }
    );
    return result.value;
}

/**
 * Lista cuidadores ativos
 */
async function getActiveCuidadores() {
    const users = await getUsersCollection();
    return await users.find({
        $and: [
            {
                $or: [
                    { role: 'cuidador' },
                    { userType: 'cuidador' }
                ]
            },
            {
                $or: [
                    { isActive: { $ne: false } },
                    { isActive: { $exists: false } }
                ]
            }
        ]
    }).toArray();
}

module.exports = {
    connectToDatabase,
    getUsersCollection,
    getAllUsers,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    getActiveCuidadores
};

