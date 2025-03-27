const router = require("express").Router();
const db = require("../models");
//const validate = require("validate.js");
const productServices = require("../services/productServices");

const constraints = {
  email: {
    length: {
      minimum: 4,
      maximum: 200,
      tooShort: "^E-postadressen måste vara minst %{count} tecken lång.",
      tooLong: "^E-postadressen får inte vara längre än %{count} tecken lång.",
    },
    email: {
      message: "^E-postadressen är i ett felaktigt format.",
    },
  }, //här slutar email
  f_name: {
    length: {
      minimum: 2,
      maximum: 50,
      tooShort: "^Förnamnet måste vara minst %{count} tecken lång.",
      tooLong: "^Användarnamnet får inte vara längre än %{count} tecken lång.",
    },
  },
  l_name: {
    length: {
      minimum: 2,
      maximum: 150,
      tooShort: "^Användarnamnet måste vara minst %{count} tecken lång.",
      tooLong: "^Användarnamnet får inte vara längre än %{count} tecken lång.",
    },
  },
};

//check  get all users
router.get("/", (req, res) => {
  productServices.getAllUsers().then((result) => {
    res.status(result.status).json(result.data);
  });
});


//check  get carts som tillhör en user
router.get("/:id/carts", (req, res) => {
  const  id= req.params.id;

  productServices.getByUser(id).then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.get("/:id/reviews", (req, res) => {
  const  id= req.params.id;

  productServices.getReviewByUser(id).then((result) => {
    res.status(result.status).json(result.data);
  });
});

router.get("/:id/review", (req, res) => {
  const  id= req.params.id;

  productServices.getReviewById(id).then((result) => {
    res.status(result.status).json(result.data);
  });
});
//check  get en viss users via id
router.get("/:id", (req, res)=>{
  const id = req.params.id;
  productServices.getByUserID(id).then((result) => {
    console.log("test av id via services");
    res.status(result.status).json(result.data);
  });
});

//check
router.post("/", (req, res) => {
  const user = req.body;
  
  // Ensure new users have a password and role
  if (!user.password) {
    user.password = 'default123'; // Set a default password if none provided
  }
  if (!user.role) {
    user.role = 'customer'; // Default role
  }
  
  db.user.create(user).then((result) => {
    // Remove password from response
    const { password, ...userWithoutPassword } = result.toJSON();
    res.send(userWithoutPassword);
  }).catch(err => {
    res.status(400).json({ error: err.message });
  });
});


router.put("/:id", (req, res)=>{
  const id = req.params.id;
  const user = req.body
  productServices.updateUser(id, user).then((result) => {
    res.status(result.status).json(result.data);
  });

});



router.put("/:id/review",(req,res)=>{
  const id = req.params.id;
  const review = req.body
  productServices.updateReview(id, review).then((result)=>{
    res.status(result.status).json(result.data);
  });
});

router.delete("/:id/destroyReview", (req, res) => {
  const id= req.params.id;
 
  
  productServices.destroyReview(id).then((result) => {
    res.status(result.status).json(result.data);
  })
})


router.delete("/:id", (req, res)=>{
  const id = req.params.id;
  productServices.destroyUser(id).then((result) => {
    res.status(result.status).json(result.data);
  });

});
module.exports = router;
