const submitTodoNode= document.getElementById("submitTodo");
const userInputNode= document.getElementById("userInput");
const prioritySelectorNode=document.getElementById("prioritySelector");

const todoListNode= document.getElementById("todo-item");

//listen to click of submit button
submitTodoNode.addEventListener("click", function(){
    //get text from the input
    //send text to server using api (fetch or xmlhttp request)
    //get response from server
    // if req is successful then diplay text in the list
    //else diplay error message

    const todoText= userInputNode.value;
    const priority= prioritySelectorNode.value;
   
    if(!todoText || !priority){
        alert("please enter a todo");
        return;
    }

    //object
    const todo={
        //below sytax inside obj ,todoText : key and above const todoText: value.
        todoText, //if key and value are same then we can write like this.
        priority,
    };

    
    fetch("/todo",{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(todo),
        //since async , isiliye .then
        //server se jaise response aayega hume yeha paata chal jaayega, using status.

    }).then(function(response){ 
        if(response.status===200)
        {
           // response.json().then(function(data){
             //   data.forEach(function(todo){
                    showTodoInUI(todo);
             //   });
           // });
        }
        else if(response.status===401){
           // alert("Please login firs");
           window.location.href="./log";
        }
        else
        {
            alert("Some problem has occured");
        }
    });
    
});


function showTodoInUI(todo){
    // todo show krne k liye element banayenge like label or any element could be made also.
    const todoTextNode= document.createElement("nikhil");
    todoTextNode.innerText= todo.todoText;

    todoListNode.appendChild(todoTextNode);
}


//to show todo on page after reload or next time.   have to do app.get(todo) in todoserver
//will fetch from server.
fetch("/todo-item")
.then(function(response){
   if(response.status===200){
    return response.json();
   }
    else
    {
     alert("Some problem has occured");
    }

})
.then(function(todos){
    todos.forEach(function(todo){
        showTodoInUI(todo);
    });
});