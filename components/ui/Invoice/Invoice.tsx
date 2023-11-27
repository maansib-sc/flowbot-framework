import React, { useState } from 'react';
import styles from '@/configuration/CSS/Index.module.css';
import Button from '../Buttons/Button';

const Invoice = ({
    options,
    values,
    onChange,
}: {
    options: { label: string; value: string }[];
    values: string;
    onChange: (value: string) => void;
}) => {

    const [selectedValues, setSelectedValue] = useState<string[]>([])
    const [showButton, setShowButton] = useState(true)
    const [show, setShow] = useState(false)
    const handleCheckboxChange = (value: string) => {
        if (selectedValues.includes(value)) {
            // If the value is already selected, remove it
            setSelectedValue(selectedValues.filter((val) => val !== value));
        } else {
            // If the value is not selected, add it
            setSelectedValue([...selectedValues, value]);
        }
    };

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {options.map((option, index) => (
                    <>
                        <label key={option.value}
                            style={{ width: '100%', border: "none", padding: "0px" }}
                            className={`${styles.checkboxLabel}`}
                        >
                            <div>
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => handleCheckboxChange(option.value)}
                                    className={styles.checkboxInput}
                                />
                                {option.label}
                            </div>
                            <div style={{ color: "var(--orange-100, #FF6900)", cursor: "pointer" }} onClick={() => setShow(!show)}>
                                View Details{" "} ▼
                            </div>
                        </label>
                        {index === 0 && show &&
                            < div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "12px" }}>
                                Description
                                <p>We are in need of a comprehensive bathroom remodel. The project scope involves a total overhaul, including the removal of the existing bathtub to create a spacious walk-in shower. In addition, we require a new floor installation, a modern vanity, and updated lighting fixtures.</p>
                                <div className="grid grid-cols-4 gap-4 pt-4">
                                    <div>
                                        <div style={{ color: "var(--grey-100, #727A8B)" }}>
                                            City
                                        </div>
                                        <p>Sarasota</p>
                                    </div>
                                    <div>
                                        <div style={{ color: "var(--grey-100, #727A8B)" }}>
                                            State
                                        </div>
                                        <p>Florida</p>
                                    </div>
                                    <div>
                                        <div style={{ color: "var(--grey-100, #727A8B)" }}>
                                            Total Labor Hours
                                        </div>
                                        <p>80</p>
                                    </div>
                                    <div>
                                        <div style={{ color: "var(--grey-100, #727A8B)" }}>
                                            Total Project Duration
                                        </div>
                                        <p>7 days</p>
                                    </div>
                                </div>
                                <h6>Material used:</h6>
                            </div >}
                    </>
                ))}

            </div >
            {showButton && <div>
                <Button onClick={() => { onChange(selectedValues.toString()); setShowButton(false) }}>Confirm</Button>
            </div >
            }
        </>
    );
};

export default Invoice;
