import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3005/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPrice(res.data.price);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Kunde inte hämta produkt", err);
        setLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    axios
      .put(`http://localhost:3005/products/${id}`, {
        title,
        description,
        price,
      })
      .then(() => {
        navigate(`/products/${id}`);
      })
      .catch((err) => {
        console.error("Kunde inte uppdatera produkt", err);
      });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Redigera produkt
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Beskrivning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            label="Pris"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Spara ändringar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditProduct;
