import { Rating } from '@smastrom/react-rating'
import styles from './RatingCard.module.css'
import '@smastrom/react-rating/style.css'
import { useState } from 'react';
import Button from '../Buttons/Button';


const CustomStar = (
    <path d="M9.09993 2.38977C9.50177 1.69991 10.4984 1.69991 10.9002 2.38977L13.2294 6.38871L17.7523 7.36814C18.5326 7.5371 18.8406 8.48494 18.3087 9.08027L15.2252 12.5312L15.6913 17.1354C15.7718 17.9297 14.9655 18.5155 14.2349 18.1936L10.0001 16.3274L5.76523 18.1936C5.03468 18.5155 4.22839 17.9297 4.30882 17.1354L4.77499 12.5312L1.69153 9.08027C1.1596 8.48494 1.46758 7.5371 2.24783 7.36814L6.7708 6.38871L9.09993 2.38977Z"/>
  )
  
  const myStyles = {
    itemShapes: CustomStar,
    itemStrokeWidth: 0,
    activeFillColor: '#FF6900',
    activeStrokeColor: '#FF6900',
    inactiveFillColor: '#ccc',
    inactiveStrokeColor: '#ccc'
  }

interface Rating {
    label: string;
    value: number;
}

function RatingCard({onClose, options}: {options: [{label: string, value: number}]; onClose: (value: string) => void; }) {
    const [ratings, setRatings] = useState<Rating[]>(options);
    const [showButton, setShowButton] = useState<Boolean>(true);

    function handleRating(value: number, index: number) {
        const updatedRatings = ratings.map((rating, i) => {
            if (i === index) {
                return { ...rating, value };
            }
            return rating;
        });
        setRatings(updatedRatings)
    }

    return (
        <>
        {ratings.map((item, index) => 
            <div key={index} className={styles.container}>
                <p>{item.label}</p>
                <Rating
                    style={{ maxWidth: 120 }}
                    value={item.value}
                    onChange={(value: number) => handleRating(value, index)}
                    itemStyles={myStyles}
                />
            </div>
            )}
        {showButton && <div className='mt-6'> 
            <Button onClick={() => {
                onClose(JSON.stringify(ratings)); 
                setShowButton(false)
            }}>Submit</Button>
        </div> }
        </>
    )

}

export default RatingCard;