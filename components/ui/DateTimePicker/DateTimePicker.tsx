import {useState, useEffect} from 'react';
import DatePicker from "../DatePicker/DatePicker";
import TimePickerComponent from "../TimePicker/TimePicker";
import Button from '../Buttons/Button';



function DateTimePicker ({onClose}: {onClose: (value: string) => void}) {
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [showButton, setShowButton] = useState(true);

    return (
        <>
        <div className="flex gap-4">
            <DatePicker onChange={(value: string) => setDate(value)}/>
            <TimePickerComponent onChange={(value: string) => setTime(value)} />
        </div>
        {showButton && <div className='mt-4'>
            <Button onClick={() => {
                onClose(JSON.stringify({date: date, time: time}))
                setShowButton(false)
                }}>Submit</Button>
          </div>
        }
        </>
        )
    

}

export default DateTimePicker;