const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { PORT } = require('../src/config/serverConfig');
const apiRoutes = require('./routes/index');
const db = require('./models/index');

const setUpAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', apiRoutes);

    app.listen(PORT, () => {
        console.log(`Server Started on the ${PORT}`);
        
        if (process.env.DB_SYNC) {
            db.sequelize.sync({ alert: true });
        }
    })
}

setUpAndStartServer();