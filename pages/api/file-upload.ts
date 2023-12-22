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

    if (data) {
      /* Create directory for uploads */
      const { chatId, sessionId } = data?.fields;
      const fileType = data?.files.file[0].mimetype;
      const filename = data?.files.file[0].originalFilename;
      let targetPath = path.join(process.cwd(), `/fileUpload/`);
      try {
        await fs.promises.access(targetPath);
      } catch (e) {
        await fs.promises.mkdir(targetPath);
      }
      targetPath = path.join(process.cwd(), `/fileUpload/${sessionId}/`);
      try {
        await fs.promises.access(targetPath);
      } catch (e) {
        await fs.promises.mkdir(targetPath);
      }

      // read file from the temporary path
      const tempPath = data?.files?.file[0].filepath;
      try {
        await fs.promises.rename(
          tempPath,
          path.join(targetPath, `/${filename}`),
        );
      } catch (error) {
        console.log('error from temp PAth==>', error);
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
