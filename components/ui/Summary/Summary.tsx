import React, { useEffect, useState } from 'react';
import styles from './Summary.module.css';
import Button from '../Buttons/Button';

interface IDataItem {
  label: string;
  value: string;
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
    }[];
  };
  onChange: () => void;
}

interface InputItem {
  key: string;
  category_id?: string;
  category_description?: string;
  answer: string;
}

interface OutputItem {
  header: string;
  step: string;
  data: { label: string; value: string }[];
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
          if (item.category_id) {
            const existingCategory = output.find((outputItem) => outputItem.header === item.category_description);

            if (existingCategory) {
              existingCategory.data.push({ label: item.key, value: item.answer });
            } else {
              const newCategory: OutputItem = {
                header: item.category_description || 'Uncategorized',
                step: item.category_id,
                data: [{ label: item.key, value: item.answer }],
              };
              output.push(newCategory);
            }

            currentStep = output.find((outputItem) => outputItem.header === item.category_description);
          } else {
            // If category_id is not present, push the item to the current step's data
            if (currentStep) {
              currentStep.data.push({ label: item.key, value: item.answer });
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
                <div className={styles.item} key={ind}>
                  <h3 className={styles.h3}>{dataItem.label}</h3>
                  <span className={styles.span}>{dataItem.value}</span>
                </div>
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
