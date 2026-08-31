import { fetchAndSeedCatImages } from '../lib/catImages';

async function main() {
  console.log('🐱 Seeding cat images for Cinder...');
  
  try {
    const insertedCount = await fetchAndSeedCatImages(80);
    console.log(`✅ Successfully inserted ${insertedCount} cat images`);
  } catch (error) {
    console.error('❌ Error seeding cat images:', error);
    process.exit(1);
  }
}

main();
