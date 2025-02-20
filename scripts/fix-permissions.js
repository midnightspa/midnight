const fs = require('fs').promises;
const path = require('path');

async function fixPermissions() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Set directory permissions
    await fs.chmod(uploadsDir, 0o755);
    
    // Get all files in the uploads directory
    const files = await fs.readdir(uploadsDir);
    
    // Fix permissions for each file
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      await fs.chmod(filePath, 0o644);
    }
    
    console.log('Permissions fixed successfully');
  } catch (error) {
    console.error('Error fixing permissions:', error);
  }
}

// Run immediately
fixPermissions();

// Export for use in other files
module.exports = fixPermissions; 