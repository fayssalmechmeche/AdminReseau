const express = require('express');
const app = express();
const port = 8081;


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    console.log('Hello World!');
    res.send('Hello World!');
});


