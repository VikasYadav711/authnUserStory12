const fs=require("fs");
const express=require("express");
var session=require("express-session");

const app=express();

app.use(session({
    secret: "maikyubataun",
    resave: false,
    saveUninitialized: true,
})
);

app.use(express.json()); //middleware to handle the chunks coming in req from json : it's json parsing 
app.use(express.urlencoded({extended:true}));  // url parsing

app.get("/",function(req,res){
  if(req.session.isLoggedIn){
        res.redirect("/todo");
        return;
    } 
    res.sendFile(__dirname+"/log.html");
});

//get data form request
// save data in file
//send response
app.post("/todo", function(req,res){
    if(!req.session.isLoggedIn){
        res.status(401).send("error");
        return;
    }
    saveTodoInFile(req.body, function(err){  // we'll paas data to store, if succesfull good otherwise error
        if(err){
            res.status(500).send("error");
            return;
        }
        res.status(200).send("sucess");
    });
    
    // alternate of below code as separate function has been written in the last of program,
    // so here we'll simply call the build function
});

app.get("/todo-item",function(req,res){

    if(!req.session.isLoggedIn){
        res.status(401).send("error");
        return;
    }
    readAllTodos(function(err,data){
        if(err){
            res.status(500).send("error");
            return;
        }
        res.status(200).json(data);  //json is a function of express which converts json data obj into string
        //alternate of above line: res.status(200).send(JSON.stringfy(data));
    });
});

  app.get("/todo",function(req,res){
    if(!req.session.isLoggedIn){
        res.redirect("/log");
        return;
    } 
      res.sendFile(__dirname+"/todo.html");
  });



app.get("/todoScript.js",function(req,res){
    res.sendFile(__dirname+"/scripts/todoScript.js");
});


app.post("/log", function(req,res){
  
    const username= req.body.email;
    const password= req.body.password;

    if(username==="vikas.savy117@gmail.com" && password==="n")
    {
        //res.status(200).send("success");
        req.session.isLoggedIn=true;
        req.session.username=username;
        res.redirect("/todo");
        return;
    }
    res.status(401).redirect("/error");
    //res.status(401).send("error");
    //console.log(username,password);
});

// pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" title="Please enter a valid email address" />

app.get("/error",function(req,res){
    res.sendFile(__dirname+"/error.html");
});

app.get("/createAccount",function(req,res){
    res.sendFile(__dirname+"/createAccount.html");
});

app.get("/log",function(req,res){
    res.sendFile(__dirname+"/log.html");
});

app.listen(3000, function(){
    console.log("server on port 3000");
});


function readAllTodos(callback){
    fs.readFile("./text.txt", "utf-8", function(err,data){
        if(err){
            callback(err);
            return;
        }

        if(data.length===0){
            data="[]";
        }
        try{
            data=JSON.parse(data);
            callback(null,data);
        }
        catch(err){
            callback(err);
        }
    });
}

function saveTodoInFile(todo,callback){
    readAllTodos(function(err,data){
        if(err){
            callback(err);
            return;
        }
        data.push(todo);

        fs.writeFile("./text.txt", JSON.stringify(data), function(err){
            if(err){
                callback(err);
                return;
            }

            callback(null);
        });
    });
}





/*
    fs.readFile("/text.txt", "utf-8", function(err,data){  //1. file read
        
        if(err){
            res.status(500).json({
                message: "Internal server error",
            });
            return;
        }

        if(data.length===0)
        {
            data="[]";  // if file is empty, we assigned empty string in file.
        }
        // try catch is implemented to take care whether if there's data in file then it should be json format or required format.
        //we've to think like these as possible cases.

        try {        
            data= JSON.parse(data);  //2. data append
            data.push(req.body);  
            
            
            fs.writeFile("/text.txt",JSON.stringify(data), function(err){       //3.write file
                 if(err){
                    res.status(500).json({
                        message: "Internal server error",
                    });
                    return;
                }

                res.status(200).json({
                    message: "Todo saved successfully",
                });
            });
        } 
        catch(err) {
            res.status(500).json({
                message: "Internal server error",
            });
            return;
        }
    });

*/