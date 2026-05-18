import { IncomingForm } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // parse form with a Promise wrapper
        const data = await new Promise<any>((resolve, reject) => {
            const form = new IncomingForm();

            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        const { chatBotId, fileType, serverType } = data.fields;
        if (data && chatBotId && fileType && serverType) {
            const tempPath = data?.files?.file[0].filepath;

            const botId = chatBotId[0];
            const targetDir = path.join(process.cwd(), `/configuration/${botId}/${serverType[0].toLowerCase()}`);
            const fileName = fileType[0] === 'js' ? 'index.js' : 'Index.module.css';
            const targetPath = path.join(targetDir, fileName);

            try {
                // Check if the file already exists and delete it if it does
                await fs.promises.access(targetPath);
                await fs.promises.unlink(targetPath);
                console.log("Existing file deleted");
            } catch (e) {
                console.log("No existing file to delete");
            }

            // Move the uploaded file to the target directory
            const rawData = await fs.promises.readFile(tempPath);
            await fs.promises.writeFile(targetPath, rawData);

            return res.status(200).json({ msg: 'File uploaded and replaced successfully' });
        } else {
            return res.status(400).json({ error: 'Required fields are missing' });
        }
    } catch (error: any) {
        return res
            .status(500)
            .json({ error: 'no such file or directory' });
    }
};
