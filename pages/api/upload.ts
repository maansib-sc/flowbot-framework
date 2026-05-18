import { IncomingForm } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
const AdmZip = require('adm-zip');

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

    function formatChatBotId(chatBotId: String) {
      const fileNameWithoutExtension = chatBotId.replace(/\.zip$/, '');
      const lowerCaseFileName = fileNameWithoutExtension.toLowerCase();
      const urlFriendlyFileName = lowerCaseFileName.replace(/\s+/g, '-');
      return urlFriendlyFileName;
    }

    if (data) {
      /* Create directory for uploads */
      const { chatBotId } = data?.fields;
      const fileType = data?.files.file[0].mimetype;

      let botId = formatChatBotId(chatBotId[0]);

      let targetPath = path.join(process.cwd(), `/configuration/${botId}`);

      try {
        await fs.promises.access(targetPath);
      } catch (e) {
        await fs.promises.mkdir(targetPath);
      }

      // read file from the temporary path
      const tempPath = data?.files?.file[0].filepath;

      if (fileType === 'application/zip') {
        // Unzip the file
        const zip = new AdmZip(tempPath);
        zip.extractAllTo(targetPath, true);

        // Optionally, you can remove the original zip file after extraction
        // fs.unlink(tempPath);
      }
      return res.status(200).json({ msg: 'file uploaded' });
    } else {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || 'Something went wrong' });
  }
};
