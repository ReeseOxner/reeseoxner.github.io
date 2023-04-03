const express = require('express');
const showdown = require('showdown');
const app = express();

// Set up the markdown converter
const converter = new showdown.Converter();

// Define a route that displays the default message
app.get('/', (req, res) => {
  res.send('<h1>The world is quiet here.</h1>');
});

// Define a route that displays the content based on URL parameters
app.get('/content', (req, res) => {
  const markdown = req.query.content || '';
  console.log(markdown); // Add this line to see if the parameter is correctly extracted
  const html = converter.makeHtml(markdown);
  console.log(html); // Add this line to see the HTML output
  res.send(html);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
