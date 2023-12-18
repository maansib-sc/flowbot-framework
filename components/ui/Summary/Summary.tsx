import React, { useEffect, useState } from 'react';
import styles from './Summary.module.css';
import Button from '../Buttons/Button';
import FileUploderIcon from '@/assets/svgs/icons/FileUploderIcon';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface IDataItem {
  label: string;
  value: string;
  inputType: string;
  summary: boolean;
}

interface IItem {
  header: string | null;
  step: string | null;
  data: IDataItem[];
}

interface IProps {
  data?: {
    data: {
      category_id: string;
      key: string;
      answer: string;
      inputType: string;
      summary: boolean;
    }[];
  };
  onChange: () => void;
}

interface InputItem {
  key: string;
  category_id?: string;
  category_description?: string;
  answer: string;
  inputType: string;
  summary: boolean;
}

interface OutputItem {
  header: string;
  step: string;
  data: { label: string; value: string, inputType: string; }[];
}

const Summary = (props: IProps) => {
  const [dummyData, setDummyData] = useState<IItem[]>([]);
  const [showButton, setShowButton] = useState<Boolean>(true)

  useEffect(() => {
    if (props.data) {
      function convertArray(inputArray: InputItem[]): OutputItem[] {
        const output: OutputItem[] = [];

        let currentStep: OutputItem | undefined;

        inputArray.forEach((item) => {
          if (item.summary) {
            if (item.category_id) {
              const existingCategory = output.find((outputItem) => outputItem.header === item.category_description);

              if (existingCategory) {
                existingCategory.data.push({ label: item.key, value: item.answer, inputType: item.inputType });
              } else {
                const newCategory: OutputItem = {
                  header: item.category_description || 'Uncategorized',
                  step: item.category_id,
                  data: [{ label: item.key, value: item.answer, inputType: item.inputType }],
                };
                output.push(newCategory);
              }

              currentStep = output.find((outputItem) => outputItem.header === item.category_description);
            } else {
              // If category_id is not present, push the item to the current step's data
              if (currentStep) {
                currentStep.data.push({ label: item.key, value: item.answer, inputType: item.inputType });
              }
            }
          }
        });

        return output;
      }

      const test = convertArray(props.data)
      setDummyData(test);
    }
  }, [props.data]);

  return (
    <div>
      <div className={styles.bodyContainer}>
        {dummyData?.map((item, index) => (
          <div className={styles.itemContainer} key={index}>
            <div className={styles.headerContainer}>
              <div className={styles.stepCircle}>{item.step}</div>
              <div className={styles.stepText}>{item.header}</div>
            </div>

            <div className={styles.mapContainer}>
              {item.data?.map((dataItem, ind) => (
                <>
                <div className={styles.item} key={ind}>
                  <h3 className={styles.h3}>{dataItem.label}</h3>
                  {dataItem.inputType === "password" ?
                    <span className={styles.span}>{"*".repeat(dataItem.value.length)}</span>
                    :
                    dataItem.inputType === "multiselect" || dataItem.inputType === "checkboxButton" ?
                      (<div style={{ display: 'flex', columnGap: "8px", paddingTop: "4px" }}>
                        {
                          JSON.parse(dataItem.value).map((item : {label: string, value: string}) =>
                            <span className={styles.span} style={{ padding: "4px 8px", backgroundColor: "#F1F4F9", borderRadius: "6px", color: "#727A8B" }}>{item.label}</span>
                          )
                        }
                      </div>)
                      :
                      dataItem.inputType === "select" || dataItem.inputType === "cardRadio" || dataItem.inputType === "radioButton" ?
                        <span className={styles.span}>{JSON.parse(dataItem.value).label}</span>
                        :
                        dataItem.inputType === "fileUploader" ?
                          <div className='flex gap-x-1 pt-1'>
                            <FileUploderIcon />
                            <span className={styles.span}>{dataItem.value}</span>
                          </div>
                          :
                          dataItem.inputType !== "markdown" ?
                          <span className={styles.span}>{dataItem.value}</span>:
                          null
                  }
                </div>
                  {dataItem.inputType === "markdown" && <div>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {dataItem.value}
                    </ReactMarkdown>
                  </div>
                  }
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showButton && <Button onClick={() => { props.onChange(); setShowButton(false) }}>Confirm</Button>}
    </div>
  );
};

export default Summary;
