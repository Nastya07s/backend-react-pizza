const express = require('express');
const app = express();
const port = 3001;

const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/pizzas');

  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const itemSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  types: [Number],
  sizes: [Number],
  price: Number,
  category: Number,
  rating: Number,
});

const Item = mongoose.model('Item', itemSchema);

function ItemsDto(item) {
  return {
    id: item._id,
    imageUrl: item.imageUrl,
    title: item.title,
    types: item.types,
    sizes: item.sizes,
    price: item.price,
    category: item.category,
    rating: item.rating,
  };
}

app.get('/items', async (req, res) => {
  const sortObject = {};

  const { sortBy, order, ...filter } = req.query;

  if (sortBy) {
    sortObject[sortBy] = order || 'asc';
  }

  const items = await Item.find(filter).sort(sortObject);

  const resultItems = items.map((item) => ItemsDto(item));

  res.set('Access-Control-Allow-Origin', '*');

  res.send(resultItems);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
