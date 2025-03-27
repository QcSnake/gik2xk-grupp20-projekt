import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import { updateReview, getReviewById } from "../models/userModel";
 


function ReviewEdit() {
    const params = useParams();
    const reviewId = params.id;
    const [alertOpen, setAlertOpen] = useState(false);
    
     const [ review, setReview] = useState(false);
 useEffect(() => {
    getReviewById(reviewId).then((review) => setReview(review));
 }, [reviewId]);
    
    function reviewUpdate(review) {
    
        updateReview( review, reviewId ).then(() => setAlertOpen(true));
    }
   
       
    return (
    < Box >
    < Typography variant = "h4" component = "h2" >
     
            Recensionsformulär
          </Typography>
          <ReviewForm onSave={reviewUpdate}></ReviewForm>
          </Box>)

}
export default ReviewEdit;