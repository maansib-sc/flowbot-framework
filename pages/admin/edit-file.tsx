import { GetServerSideProps } from 'next';
import FileEditor from '@/components/FileEditor';
import { getJsTest } from '@/utils/Configfiles';
import { updateConfig } from '@/apiRequests';

interface EditorProps {
  fileType: 'json' | 'javascript' | 'css';
  serverType?: 'server' | 'webapp' | 'webapp.css'
  fileContent: string;
  chatbotId?: string
}


export const getServerSideProps: GetServerSideProps<EditorProps> = async (context) => {
  const { chatbotId, filetype } = context.query;
  let fileContent
  let fileType
  if (chatbotId && typeof chatbotId === "string" && filetype && typeof filetype === "string") {
    if (filetype === 'webapp.css') {
      fileType = "css"
    } else {
      fileType = "javascript"
    }
    fileContent = await getJsTest(chatbotId, filetype);
    if (typeof fileContent === "string" && typeof chatbotId === "string" && typeof filetype === "string") {
      const props: EditorProps = {
        fileType: fileType as 'json' | 'javascript' | 'css',
        serverType: filetype as 'server' | 'webapp' | 'webapp.css', 
        fileContent,
        chatbotId
      };
      return {
        props
      };
    }
  }

  return { notFound: true };

  

};

export default function EditFilePage({ fileContent, fileType, chatbotId, serverType = "server" }: EditorProps) {


  const handleSubmit = async (content: string) => {
    if (content && chatbotId) {
      await updateConfig(chatbotId, serverType, content)
    }
  }

  return (
    <div className='flex'>
      <div className='p-6'>
        <ul className="flex flex-col space-y-2">
          <li>
            <strong className="block text-xs font-medium uppercase text-gray-400"> Server </strong>

            <ul className="mt-2 space-y-1">
              <li>
              <a
                  href={`edit-file?chatbotId=${chatbotId}&filetype=server`}
                  className={(serverType === 'server') ? `block rounded-lg px-4  bg-gray-100 py-2 text-sm font-medium text-gray-700`:  `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500`}
                >
                  index.js
                </a>
              </li>
            </ul>
          </li>

          <li>
            <strong className="block text-xs font-medium uppercase text-gray-400"> WebApp </strong>

            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href={`edit-file?chatbotId=${chatbotId}&filetype=webapp`}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700  ${(serverType === 'webapp') ? " bg-gray-100 text-gray-700": ""}`}
                >
                  index.js
                </a>
              </li>

              <li>
                <a
                  href={`edit-file?chatbotId=${chatbotId}&filetype=webapp.css`}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700  ${(fileType === 'css') ? " bg-gray-100 text-gray-700": ""}`}
                >
                  Index.module.css
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div style={{width: "100%"}}>
        <FileEditor fileType={fileType} fileContent={fileContent} handleSubmit={handleSubmit}/>
      </div>
    </div>
  );
}