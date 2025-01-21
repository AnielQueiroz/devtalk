import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import Tag from '../models/tags.model.js';

dotenv.config();

const seedTags = [
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'MongoDB' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Express.js' },
    { name: 'Python' },
    { name: 'Java' },
    { name: 'C++' },
    { name: 'Ruby' },
    { name: 'PHP' },
    { name: 'Go' },
    { name: 'C#' },
    { name: 'Swift' },
    { name: 'SQL' },
    { name: 'TypeScript' },
    { name: 'Angular' },
    { name: 'Vue.js' },
    { name: 'Svelte' },
    { name: 'React Native' },
    { name: 'Flutter' },
    { name: 'Kotlin' },
    { name: 'Dart' },
    { name: 'Rust' },
    { name: 'C' },
    { name: 'Assembly' },
    { name: 'R' },
    { name: 'Scala' },
    { name: 'Haskell' },
    { name: 'Clojure' },
    { name: 'Perl' },
    { name: 'Elixir' },
    { name: 'Ruby on Rails' },
    { name: 'Laravel' },
    { name: 'Spring Boot' },
    { name: 'Django' },
    { name: 'Flask' },
    { name: 'Next.js' },
    { name: 'Nuxt.js' },
    { name: 'Nest.js' },
    { name: 'FastAPI' },
    { name: 'GraphQL' },
    { name: 'gRPC' },
    { name: 'REST' },
];
    
const seed = async () => {
    try {
        await connectDB();
        
        await Tag.insertMany(seedTags);
    } catch (error) {
        console.log('Erro ao popular tags: ', error);
    }
};

seed();