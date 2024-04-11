const express = require("express");
const app = express();
const cors = require('cors');
const Router = require("./Router");

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cors());
app.use(express.static("./Static"))
app.use(Router)


app.listen(3000,
    () => {
        console.log("Server Running http://127.0.0.1:3000")
    }
)