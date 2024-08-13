import path from "path";
import fs from 'fs';
import { promises as fsPromises } from 'fs';


  export const getJsTest = async (chatbotId: string, type: string) => {
    try {
      let configPath = path.join(process.cwd(), 'configuration', chatbotId, type, 'index.js');
      if (type === 'webapp.css') {
        configPath = path.join(process.cwd(), 'configuration', chatbotId, "webapp", 'Index.module.css');
      }
      const moduleJs = fs.readFileSync(configPath, 'utf-8');
      return moduleJs;
    } catch (err) {
      console.log("error from getting Js ==> ", err);
      return null;
    }
  }


  export const updateConfigFile = async (chatbotId: string, type: string, content: string) => {
    try {
      let configPath = path.join(process.cwd(), 'configuration', chatbotId, type, 'index.js');
      if (type === 'webapp.css') {
        configPath = path.join(process.cwd(), 'configuration', chatbotId, "webapp", 'Index.module.css');
      }
      // Check if the file exists
      try {
        await fsPromises.access(configPath);
        
        // Delete the existing file
        await fsPromises.unlink(configPath);
      } catch (accessError) {
        console.log("File does not exist, creating a new one.");
      }

      // Create a new file with the content
      await fsPromises.writeFile(configPath, content, 'utf8');

      console.log("File successfully updated.");
      return "File successfully updated."
    } catch (error) {
      console.log("error occured while creating ===>", error)
      
    }
  }
  
  // const configContent = await readFilePromise(configPath);
    // return configContent