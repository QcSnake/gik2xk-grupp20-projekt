import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Link, Navigate } from "react-router-dom";
import Review from "../components/Review";
import { getReviewByUserID, remove } from "../models/userModel";
import { getByUserID } from "../models/userModel";


function Users() {

  const [user, setUser] = useState([]);
  const [reviews, setReview] = useState([]);
  const userId = 1;

    
  useEffect(() => {
    getByUserID(userId).then((user) => setUser(user));
  }, [userId]);

   useEffect(() => {
   getReviewByUserID(userId).then((review) => setReview(review));
   }, [userId]);
  

  
  function onDelete(review){ 
  
     console.log(review.id);
  remove(review).then(() => Navigate('/',{state: {message:"review was removed"}} ));
  }
 

  return user ? (
 <>
       <ul>
          <li key={`userId_${user.id}`}></li>
        <div>
          
            <Typography variant="h5" component="h3">
             
             
            </Typography>
            <Typography variant="h5" component="h3"> Förnamn: {user.f_name}</Typography>
            <br />
            <Typography variant="h5" component="h3">
             Efternamn: {user.l_name}
            </Typography>


          <Box variant="h5" component="h3">
            {reviews &&
        reviews.map((review) => {
            return (
              <li key={`reviewId_${review.id}`}>
                <Review review={review} ></Review>
                 <Link to={`/ReviewEdit/${review.id}`}>
             <EditIcon ></EditIcon>
               </Link> <Button variant="contained" color="primary" startIcon={<DeleteForeverIcon ></DeleteForeverIcon>} onClick={() => onDelete({ ...review })}>
        Ta bort
      </Button>
              </li>
            );
        })}
            
            
      </Box>

          </div>
      
        <Typography variant="h5" component="h3">
            Redigera användare
    <Link to={`/UsersEdit/${userId}`}>
            <EditIcon label="edit User" ></EditIcon>
            
          </Link>
         
        
        </Typography>
        </ul>  
    </>
  ) : (
      <Typography>Användaren saknas
        
        <EditIcon >{<Link to={`/UsersEdit/${userId}`}> {"Redigera användare"} </Link>} </EditIcon>
        
      </Typography>
      
  );
}

export default Users;
