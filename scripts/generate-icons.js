import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const baseIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3B82F6"/>
  <circle cx="256" cy="256" r="128" fill="white"/>
  <circle cx="256" cy="256" r="96" fill="#3B82F6"/>
  <circle cx="256" cy="256" r="64" fill="white"/>
</svg>
`;

async function generateIcons() {
  // Create icons directory if it doesn't exist
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  await fs.mkdir(iconsDir, { recursive: true });

  // Generate icons for each size
  for (const size of sizes) {
    const svgBuffer = Buffer.from(baseIcon);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    
    console.log(`Generated ${size}x${size} icon`);
  }
}

generateIcons().catch(console.error); 