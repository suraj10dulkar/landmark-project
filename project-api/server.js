const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

const products = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (Math.random() * 100).toFixed(2),
  category: `Category ${i % 10}`
}));

app.get('/api/products', (req, res) => {
  const { page = 1, search = '' } = req.query;
  const limit = 10;
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  res.json({
    total: filtered.length,
    page: Number(page),
    products: paginated
  });
});

app.get('/api/search-suggestions', (req, res) => {
  const { q = '' } = req.query;
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 10)
    .map(p => p.name);
  res.json(suggestions);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
