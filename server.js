const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the provided port or default to 3000

// Serve static files from the 'src' directory
app.use(express.static('src'));

// Define any additional routes or middleware as needed

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
