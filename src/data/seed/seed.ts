import { envs } from '../../config';
import {
    CategoryModel,
    MongoDataBase,
    ProductModel,
    UserModel,
} from '../mongo';
import { seedData } from './data';

(async () => {
    await MongoDataBase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
    });

    await main();

    await MongoDataBase.disconnect();
})();

const randomBetween0AnsX = (x: number) => Math.floor(Math.random() * x);

async function main() {
    // 0. Borrar BD
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);

    // 1. Crear usuarios
    const users = await UserModel.insertMany(seedData.users);

    // 2. Crear categorias
    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category => ({
            ...category,
            user: users[randomBetween0AnsX(users.length)]._id,
        }))
    );

    // 3. Crear productos
    await ProductModel.insertMany(
        seedData.products.map(product => ({
            ...product,
            user: users[randomBetween0AnsX(users.length)]._id,
            category: categories[randomBetween0AnsX(categories.length)]._id,
        }))
    );

    console.log('Seeded');
}
