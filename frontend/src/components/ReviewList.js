import { List, Rating } from '@mui/material';
import Review from './Review';

function score(newScore){
  t = newScore;
}
let t = 4;

function ReviewList({ reviews }) {
  let totScore = 0;
  let g = 0;
  /* console.log(reviews.len()); */
    return ( 
      <>
        Genomsnittligt betyg
        <Rating
        name="half-rating-read"
          defaultValue={2.5}
          value={t}
          precision={0.1}
        readOnly
        />
        <List>
            {reviews &&
              reviews.map((review, i) => {
                
                totScore += review.rating
                g=g+1

                return (
                  <li key={`productId_${review.id}`}>
                    {/* <ReviewItemSmall review={review.userId} /> */}
                    
                    <Review key={`review_${i}`} review={review} />
                  </li>
                );
                
              })}
            {score(totScore/g)}
            
          </List> 
      </>);
}

export default ReviewList;