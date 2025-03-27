import { Rating, Typography } from "@mui/material";

function Review({review}) {
    
    return (
    <>
     
      <div>
        <Typography variant="h5" component="h3"></Typography>
        <Typography> {review.summary}</Typography>
        <Typography variant="h5" component="h3">
          <Rating
            name="half-rating-read"
            defaultValue={review.rating}
            precision={0.5}
            readOnly
          />
        </Typography>
      </div>
    </>
  );
}

export default Review;