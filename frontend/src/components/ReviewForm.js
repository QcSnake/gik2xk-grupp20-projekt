import { Button, Rating, TextField } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";



  

    

function ReviewForm({onSave}) {
  const [review, setReview] = useState({ summary: "", rating: 0 });
  

  return (
    <form>
      <TextField
        name="summary"
        label="Sammanfattning"
        fullWidth
        multiline
        minRows={5}
        value={review.summary}
        onChange={(e) => setReview({ ...review, summary: e.target.value })}
      ></TextField>

      <Rating
        name="half-rating"
        value={review.rating}
        precision={0.5}
        onChange={(e) =>
          setReview({
            ...review,
            rating: parseFloat(e.target.value),
          })
        }
      />

     
      <Button
        startIcon={<SaveIcon />}
        onClick={() => onSave({ ...review, userId: 1 })}
        variant="contained"
        color="primary"
        key={``}
        sx={{marginBottom: "1rem"}}
      >
        Lägg till recension
         
      </Button>
    </form>
  );
}

export default ReviewForm;


