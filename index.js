const express = require('express')
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

var routerApi = require('./api/router');
app.use('/',routerApi);


const PORT = process.env.PORT || 8083 ;

app.listen(PORT, () => console.log(`server start on port http://localhost:${PORT}`));
