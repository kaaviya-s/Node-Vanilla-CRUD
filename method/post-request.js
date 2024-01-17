const requestBodyParser = require("../util/body-parser");
const crypto = require("crypto");
const write_to_file = require("../util/write-to-file"); 

module.exports = async (req,res) =>{
    if(req.url === "/api/movies"){
        try{
            let body = await requestBodyParser(req);
            body.id = crypto.randomUUID();
            req.movies.push(body);
            write_to_file(req.movies);
            res.writeHead(201,{'Content-Type':'application/json'});
            res.end();
        }catch(err){
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ title: "Validation Failed", message: "Request body is not valid" }));
        }
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not found!", message: "Route not found" }));
    }
};