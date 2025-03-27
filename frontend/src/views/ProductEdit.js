import { Button, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  create,
  
  getProductsById,
  remove,
  update,
} from "../models/productModel";


function ProductEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params.id;

  const [alertOpen, setAlertOpen] = useState(false);
  const emptyProduct={
    id: 0,
    title: "",
    description: "",
    price: 0,
    productImg: "",
    units: 0
  };
  const [product, setProduct] = useState(emptyProduct);
  
  useEffect(() => {
    getProductsById(productId).then((product) => setProduct(product));
  }, [productId]);

  function onSave(product) {
  /*   product.id = productId; */
    if (product.id=== 0) {
        console.log("new product created");
        create({ ...product }).then(() => setAlertOpen(true));
    } else {
    console.log("uppdated product");
     update({ ...product }).then(() => setAlertOpen(true));
    }
  }

  function onDelete(product){
   /*  if (product.id=== 0) {
        console.log("something went werry wrong!");
    } else {
        console.log("deleted product");
        remove({ ...product.id }).then(() => setAlertOpen(true));
    } */
    console.log(product.id);
  remove(product).then(() => navigate('/products',{state: {message:"product removed"}} ));
  }





  return (
    <form>
      <TextField
        fullWidth
        name="title"
        id="title"
        label="Titel"
        variant="standard"
        margin="normal"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
      >
        {" "}
      </TextField>
      <TextField
        name="description"
        label="Beskrivning"
        value={product.description}
        fullWidth
        multiline
        minRows={7}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
      >
        {" "}
      </TextField>
      <TextField
        name="price"
        label="Pris"
        value={product.price}
        fullWidth
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      >
        {" "}
      </TextField>
      <TextField
        name="imgUrl"
        label="Bildadress"
        value={product.productImg}
        fullWidth
        onChange={(e) => setProduct({ ...product, productImg: e.target.value })}
      >
        {" "}
      </TextField>

      <TextField
        name="units"
        label="Enheter"
        value={product.units}
        fullWidth
        onChange={(e) => setProduct({ ...product, units: e.target.value })}
      >
        {" "}
      </TextField>

      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={() => onSave({ ...product })}>
        Uppdatera
      </Button>

      <Button variant="contained" color="primary" startIcon={<DeleteIcon />} onClick={() => onDelete({ ...product })}>
        Ta bort
      </Button>

    </form>
  );
}

export default ProductEdit;
