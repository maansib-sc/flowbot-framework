import path from "path";
import fs from "fs";


export const getChatbotsList = async () => {
    try {
      const configPath = path.join(process.cwd(), 'configuration');
      const files = await fs.promises.readdir(configPath);
      const directories = [];
  
      for (const file of files) {
        const filePath = path.join(configPath, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
            if (file !== "default") {
                directories.push(file);
            }
        }
      }
  
      return directories;
    } catch (err) {
      return null;
    }
};


export const deleteChatbot = async (chatbotId: string) => {
    try {
        const configPath = path.join(process.cwd(), 'configuration', chatbotId);

        if (fs.existsSync(configPath)) {
            fs.rmSync(configPath, { recursive: true, force: true });
            return `Successfully deleted folder: ${chatbotId}`
        } else {
            return `Folder not found: ${chatbotId}`
        }
    } catch (error) {
        return `Error while deleting chatbotId: ${chatbotId}`
    }
};