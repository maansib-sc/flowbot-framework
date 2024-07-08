import React, { useEffect, useState } from 'react';
import styles from './Summary.module.css';
import Button from '../Buttons/Button';
import FileUploderIcon from '@/assets/svgs/icons/FileUploderIcon';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Invoice from '../Invoice/Invoice';

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
  data?: InputItem[];
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
  data: { label: string; value: string; inputType: string }[];
}

const Summary = (props: IProps) => {
  const [dummyData, setDummyData] = useState<OutputItem[]>([]);
  const [showButton, setShowButton] = useState<Boolean>(true);

  useEffect(() => {
    if (props.data) {
      function convertArray(inputArray: InputItem[]): OutputItem[] {
        const output: OutputItem[] = [];

        let currentStep: OutputItem | undefined;

        inputArray.forEach((item) => {
          if (item.summary) {
            if (item.category_id) {
              const existingCategory = output.find(
                (outputItem) => outputItem.header === item.category_description,
              );

              if (existingCategory) {
                existingCategory.data.push({
                  label: item.key,
                  value: item.answer,
                  inputType: item.inputType,
                });
              } else {
                const newCategory: OutputItem = {
                  header: item.category_description || 'Uncategorized',
                  step: item.category_id,
                  data: [
                    {
                      label: item.key,
                      value: item.answer,
                      inputType: item.inputType,
                    },
                  ],
                };
                output.push(newCategory);
              }

              currentStep = output.find(
                (outputItem) => outputItem.header === item.category_description,
              );
            } else {
              // If category_id is not present, push the item to the current step's data
              if (currentStep) {
                currentStep.data.push({
                  label: item.key,
                  value: item.answer,
                  inputType: item.inputType,
                });
              }
            }
          }
        });

        return output;
      }

      const test = convertArray(props.data);
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
                  {!['invoiceSheet', 'markdown'].includes(dataItem.inputType) && (
                    <h3 className={styles.h3}>{dataItem.label}</h3>
                  )}
                    {dataItem.inputType === 'password' ? (
                      <span className={styles.span}>
                        {'*'.repeat(dataItem.value.length)}
                      </span>
                    ) : dataItem.inputType === 'multiselect' ||
                      dataItem.inputType === 'checkboxButton' && item?.header !== "Services Offered" ? (
                      <div
                        className={styles.answerContainer}
                      >
                        {JSON.parse(dataItem.value).map(
                          (
                            item: { label: string; value: string },
                            index: any,
                          ) => (
                            <span
                              key={index}
                              className={styles.span}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#F1F4F9',
                                borderRadius: '6px',
                                color: '#727A8B',
                              }}
                            >
                              {item.label}
                            </span>
                          ),
                        )}
                      </div>
                    ) : dataItem.inputType === 'select' ||
                      dataItem.inputType === 'cardRadio' ||
                      dataItem.inputType === 'radioButton' ? (
                      <span className={styles.span}>
                        {JSON.parse(dataItem.value).label}
                      </span>
                    ) : dataItem.inputType === 'fileUploader' ? (
                      JSON.parse(dataItem.value).map((item: string, index: number) => 
                      <div key={index + 1}>
                      <div className="flex gap-x-1 pt-1">
                        <FileUploderIcon />
                          <span className={styles.span}>{item}</span>
                        </div>
                      </div>
                        )
                    ) : dataItem.inputType === 'invoiceSheet' ? null
                      : item?.header === "Services Offered" && ind === item.data.length - 1 ? null 
                      : dataItem.inputType !== 'markdown' ? (
                        <span className={styles.span}>{dataItem.value}</span>
                      ) : null}
                  </div>

                  {
                    item?.header === "Services Offered"  && ind === item.data.length - 1 && (
                      <div
                        className={styles.answerContainer}
                      >
                        {JSON.parse(dataItem.value).map(
                          (
                            item: { label: string; value: string },
                            index: any,
                          ) => (
                            <span
                              key={index}
                              className={styles.span}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#F1F4F9',
                                borderRadius: '6px',
                                color: '#727A8B',
                              }}
                            >
                              {item.label}
                            </span>
                          ),
                        )}
                      </div>
                    )
                  }

                  {dataItem.inputType === 'markdown' && (
                    <div>
                      {/* @ts-ignore */}
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {dataItem.value}
                      </ReactMarkdown>
                    </div>
                  )}
                  {dataItem.inputType === 'invoiceSheet' && (
                    <div>
                      <Invoice
                        options={JSON.parse(dataItem.value)}
                        values={JSON.parse(dataItem.value)}
                        showList={false}
                        showConfirmButton={false}
                        disabled={true}
                        onChange={(value) => {
                        }}
                      />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showButton && (
        <Button
          onClick={() => {
            props.onChange();
            setShowButton(false);
          }}
        >
          Confirm
        </Button>
      )}
    </div>
  );
};

export default Summary;
