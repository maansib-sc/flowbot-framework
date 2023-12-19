import { useState, useRef, useEffect } from 'react';
import styles from './DynamicTable.module.css'; // Import CSS module
import Button from '../Buttons/Button';

interface TableProps<T> {
    data: DataV<T>;
    onChange: (value: string) => void;
    options: {};
    total?: {label: string, value: number};
    disabled?: boolean;
    showconfirmButton?: boolean
  }
  
  interface DataV<T> {
    name: T;
    width: T;
    data: Array<T>;
  }

const DynamicTable: React.FC<TableProps<string[]>> = ({ data, onChange, options, total, disabled, showconfirmButton=false }) => {
    const [showOptions, setShowOptions] = useState<number | null>(null);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [deleteRow, setDeleteRow] = useState<number | null>(null);
    const [useData, setUseData] = useState(data);
    const [isOutsideClick, setIsOutsideClick] = useState(false);
    const [showButton, setShowButton] = useState(true);

    const containerRef = useRef(null);

    const handleContentChange = (event, index: number, childIndex: number) => {
        const newContent = event.target.value;
        const updatedData = { ...useData };
        updatedData.data[index][childIndex] = newContent;
        setUseData(updatedData);
      };

    const handleSvgClick = (index: number) => {
        if (showOptions === index) {
            setShowOptions(null);
        } else {
            setShowOptions(index);
        }
    };


    function addRow() {
        setUseData((prevUserData) => ({
            ...prevUserData,
            data: [...prevUserData?.data, ["", "", ""]],
        }));
        setEditableRow(useData.data.length)
    }

    useEffect(() => {
        if (deleteRow || deleteRow === 0) {
            let dataval = useData?.data?.filter((item, index) => index !== deleteRow)
            setUseData((prevUserData) => ({
                ...prevUserData,
                data: dataval,
              }));
        }

    }, [deleteRow])

    useEffect(() => {
        const handleOutsideClick = (event) => {
            console.log("containerRef.current ==>", containerRef.current, event.target)
          if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsOutsideClick(true);
        } else {
            setIsOutsideClick(false);
          }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);

      useEffect(() => {
        setEditableRow(null)
      }, [isOutsideClick])

    return (
        <>
        <table className={styles.table + " table-auto"}>
            <thead>
                <tr>
                    {useData?.name?.map((item, index) =>
                        <th
                            style={{ width: item.width}}
                            className={` ${index === data.name.length - 1 ? 'text-end' : (index !== data.name.length - 1 && index !== 0) ? "text-center" : 'text-start'}`}
                        >{item}</th>
                    )}
                    {options?.editable &&  <th>{" "}</th> }
                   
                </tr>
            </thead>
            <tbody>
                {useData?.data?.map((item, index) => (
                    <tr key={index} className={editableRow === index ? styles.selectedRow : ''}  ref={containerRef}>
                        {data?.name?.map((value, newindex) => [
                            <td
                                className={` ${newindex === data.name.length - 1 ? 'text-end' : (newindex !== data.name.length - 1 && newindex !== 0) ? "text-center" : 'text-start'}`}
                            >
                                {
                                    editableRow === index ? <span><input value={item[newindex]} onChange={(event) => handleContentChange(event, index, newindex)} /></span>
                                    :
                                    <span>{item[newindex]}</span>
                                }
                            </td>
                        ])
                        }

                        {options?.editable && <td className="text-end">
                            <div className="flex justify-end cursor-pointer relative" onClick={() => handleSvgClick(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                    <path d="M10 14.6719C10.6903 14.6719 11.25 15.2315 11.25 15.9219C11.25 16.6122 10.6903 17.1719 10 17.1719C9.30967 17.1719 8.75 16.6122 8.75 15.9219C8.75 15.2315 9.30967 14.6719 10 14.6719ZM10 9.67188C10.6903 9.67188 11.25 10.2315 11.25 10.9219C11.25 11.6122 10.6903 12.1719 10 12.1719C9.30967 12.1719 8.75 11.6122 8.75 10.9219C8.75 10.2315 9.30967 9.67188 10 9.67188ZM10 4.67188C10.6903 4.67188 11.25 5.23152 11.25 5.92188C11.25 6.61223 10.6903 7.17188 10 7.17188C9.30967 7.17188 8.75 6.61223 8.75 5.92188C8.75 5.23152 9.30967 4.67188 10 4.67188Z" fill="#727A8B" />
                                </svg>
                                {showOptions === index && !disabled && (
                                    <div className={styles.editContainer}>
                                        <span onClick={() => {
                                            setEditableRow(index);
                                            handleSvgClick(index)
                                        }}>Edit</span>
                                        <span
                                            onClick={() => {
                                                setDeleteRow(index);
                                                handleSvgClick(index);
                                            }}
                                        >Delete</span>
                                    </div>
                                )}
                            </div>
                        </td>}

                    </tr>
                ))}
            </tbody>
        </table>

        {total && <div className={styles.tableFooter}>
            <span className={styles.totalLabel}>{total.label}</span>
            <span className={styles.price} style={{marginRight: "14px"}}>${total.value}</span>
        </div>}
        {options?.bottomAddButton && !disabled && <div className='flex gap-2 align-middle mt-4 cursor-pointer w-fit' onClick={addRow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M9.16667 17.5885C9.16667 18.0488 9.53975 18.4219 10 18.4219C10.4602 18.4219 10.8333 18.0488 10.8333 17.5885V11.7552H16.6667C17.1269 11.7552 17.5 11.3821 17.5 10.9219C17.5 10.4616 17.1269 10.0885 16.6667 10.0885H10.8333V4.25521C10.8333 3.79497 10.4602 3.42188 10 3.42188C9.53975 3.42188 9.16667 3.79497 9.16667 4.25521V10.0885H3.33333C2.8731 10.0885 2.5 10.4616 2.5 10.9219C2.5 11.3821 2.8731 11.7552 3.33333 11.7552H9.16667V17.5885Z" fill="#FF6900"/>
            </svg>
            <span className={styles.addButton}>{options?.bottomAddButtonTitle}</span>
        </div>}

        {showconfirmButton && showButton && 
        <div className='mt-4'>
            <Button onClick={() => { onChange(JSON.stringify(useData)); setShowButton(false) }}
            >Confirm</Button>
        </div>
        }
        </>
    );
};

export default DynamicTable;
