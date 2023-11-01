import { IncomingForm } from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        // parse form with a Promise wrapper
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm()

            form.parse(req, (err, fields, files) => {
                if (err) return reject(err)
                resolve({ fields, files })
            })
        })

        if (data) {
            /* Create directory for uploads */
            const { chatId } = data?.fields
            const fileType = data?.files.file[0].mimetype
            let targetPath = path.join(process.cwd(), `/custom/JSFile/`);
            if (fileType === "text/css") {
                targetPath = path.join(process.cwd(), `/custom/CSSFile/${chatId}/`);
            }

            try {
                await fs.promises.access(targetPath);
            } catch (e) {
                await fs.promises.mkdir(targetPath);
            }

            // read file from the temporary path
            const tempPath = data?.files?.file[0].filepath;
            if (fileType === "text/javascript") {
                await fs.promises.rename(tempPath, path.join(targetPath, `${chatId[0]}.js`));
            }

            if (fileType === "text/css") {
                await fs.promises.rename(tempPath, path.join(targetPath, `Home.module.css`));
            }

            return res.status(200).json({ msg: 'file uploaded' });
        } else {
            return res.status(500).json({ error: 'Something went wrong' });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }

}