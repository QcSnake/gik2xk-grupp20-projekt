// src/components/AddProductForm.js
import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
} from "@mui/material";

function AddProductForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3005/products", {
        ...form,
        price: parseFloat(form.price),
      });

      onAdd(res.data);
      setForm({ title: "", description: "", price: "", imageUrl: "" });
    } catch (err) {
      console.error("Kunde inte lägga till produkt", err);
    }
  };

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lägg till ny produkt
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          name="title"
          label="Titel"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Beskrivning"
          fullWidth
          margin="normal"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Pris"
          fullWidth
          margin="normal"
          type="number"
          value={form.price}
          onChange={handleChange}
        />
        <TextField
          name="imageUrl"
          label="Bild-URL"
          fullWidth
          margin="normal"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Lägg till
        </Button>
      </Box>
    </Paper>
  );
}

export default AddProductForm;
