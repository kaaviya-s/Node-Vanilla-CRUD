const write_to_file = require("../util/write-to-file");
const requestBodyParser= require("../util/body-parser");

module.exports = async (req,res) =>{
    let baseUrl = req.url.substring(0,req.url.lastIndexOf("/") +1);
    let id = req.url.split("/")[3];
    const regexv4= new RegExp(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

    if(!regexv4.test(id)){
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Validation Failed", message: "UUID is not valid" }));
    }else if (baseUrl == "/api/movies/" && regexv4.test(id)){
        try{
            let body = await requestBodyParser(req);
            const index = req.movies.findIndex((movie)=>{
                return movie.id === id;
            });
            if(index == -1){
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ title: "Not Found", message: "Movie not found" }));
            }else{
                req.movies[index] = {id ,...body};
                write_to_file(req.movies);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(req.movies[index]));
            }
        }catch(err){
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ title: "Validation Failed", message: "Request body is not valid" }));
        }
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));

    }

};