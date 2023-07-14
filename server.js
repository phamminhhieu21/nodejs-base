const app = require('./src/app');
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
    // notify.send('SIGINT signal received: closing HTTP server');
});
