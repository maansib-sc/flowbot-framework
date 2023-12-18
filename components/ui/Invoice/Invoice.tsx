import React, { useState } from 'react';
import styles from './Invoice.module.css';
import Button from '../Buttons/Button';
import DynamicTable from '../DynamicTable/DynamicTable';
import CostCards from '../CostCards/CostCards';

const Invoice = ({
    options,
    values,
    onChange,
}: {
    options: { label: string; value: string, data: any, table: [] }[];
    values: any;
    onChange: (value: string) => void;
}) => {

    const [selectedValues, setSelectedValue] = useState<[{label: string; value: string; data: any, table: []}] | []>([])
    const [showButton, setShowButton] = useState(true)
    const [show, setShow] = useState<null | number>(null)
    const handleCheckboxChange = (value: { label: string; value: string, data: any, table: [] }) => {
        if (selectedValues.findIndex(item => item.value === value.value) >= 0) {
                setSelectedValue(selectedValues.filter((val) => val.value !== value.value));
            } else {
                setSelectedValue([...selectedValues, value]);
            }
        
    };

    const opendetail = (index: number) => {
        if (index === show) {
            setShow(null)
        } else {
            setShow(index)
        }
    }

    return (
        <>
            <div className={styles.invoiceContainer}>
                {options.map((option, index) => (
                    <><div className='flex justify-between'>
                        <label key={option.value}
                            style={{ border: "none", padding: "0px" }}
                            className={`${styles.checkboxLabel}`}
                        >

                            <input
                                type="checkbox"
                                value={option.value}
                                checked={selectedValues.some(item => item.value === option.value)}
                                onChange={() => handleCheckboxChange(option)}
                                className={styles.checkboxInput}
                            />
                            <span>{option.label}</span>
                        </label>
                        <div className={styles.viewDetails} onClick={() => opendetail(index)}>
                            <div style={{ width: "max-content" }}>
                                View Details
                            </div> {
                                index === show ?
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_5046_54740)">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41126 6.9107C9.73667 6.58527 10.2643 6.58527 10.5898 6.9107L15.3038 11.6248C15.6293 11.9502 15.6293 12.4778 15.3038 12.8033C14.9783 13.1287 14.4508 13.1287 14.1253 12.8033L10.0005 8.67845L5.87571 12.8033C5.55028 13.1287 5.02264 13.1287 4.69721 12.8033C4.37176 12.4778 4.37176 11.9502 4.69721 11.6248L9.41126 6.9107Z" fill="#FF6900" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_5046_54740">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    :
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5898 14.0109C10.2643 14.3363 9.73667 14.3363 9.41126 14.0109L4.69721 9.29682C4.37176 8.97142 4.37176 8.44378 4.69721 8.11834C5.02264 7.79291 5.55028 7.79291 5.87571 8.11834L10.0005 12.2432L14.1253 8.11834C14.4508 7.79291 14.9783 7.79291 15.3038 8.11834C15.6293 8.44378 15.6293 8.97142 15.3038 9.29682L10.5898 14.0109Z" fill="#FF6900" />
                                    </svg>
                            }
                        </div>
                    </div>

                        {index === show &&
                            < div className={styles.descriptionContainer}>
                                Description
                                <p className={styles.description}>{option?.data?.description}</p>
                                <div className="grid grid-cols-4 gap-4 pt-4">
                                    {[{ title: "City", value: option.data.city }, { title: "State", value: option.data.state }, { title: "Total Labor Hours", value: option.data.lobourHours }, { title: "Total Project Duration", value: option.data.duration }].map((item) =>
                                        <div>
                                            <div style={{ color: "var(--grey-100, #727A8B)" }}>
                                                {item.title}
                                            </div>
                                            <p className={styles.description}>{item.value}</p>
                                        </div>
                                    )
                                    }
                                </div>
                                {
                                    option?.table?.map((data, index) => {
                                        return (
                                            <>
                                                <h6 className='pt-8' style={{ color: "var(--grey-100, #727A8B)" }}>{data?.name}</h6>
                                                <div className='mt-4'>
                                                    <DynamicTable data={data?.data} total={data.total} onChange={(value) => null} />
                                                </div>
                                            </>
                                        )
                                    })
                                }
                                {/* <div>
                                    <p>Before and after picture</p>
                                    <div className='grid grid-cols-3 grid-flow-col gap-4'>
                                        <div>Image 1</div>
                                        <div>Image 2</div>
                                        <div>Image 3</div>
                                    </div>
                                </div> */}
                                <div className='mt-6'>
                                    <CostCards
                                        options={[
                                            { id: 1, text: "Subtotal:", price: `$${option.data.cost.subtotal}` },
                                            { id: 2, text: "Tax:", price: `$${option.data.cost.tax}` },
                                            { id: 3, text: "Total:", price: `$${option.data.cost.total}` },
                                            { id: 4, text: "Draw Amount:", price: `$${option.data.cost.drawamount}` }]}
                                        onChange={(value) => {
                                        }}
                                        showSubmit={false}
                                        fontSize='32px'
                                    />
                                </div>

                            </div >}
                    </>
                ))}
            </div >
            {showButton && <div className='mt-4'>
                <Button onClick={() => { onChange(JSON.stringify(selectedValues)); setShowButton(false) }}
                    disabled={selectedValues.length === 0}
                >Confirm</Button>
            </div >
            }
        </>
    );
};

export default Invoice;
