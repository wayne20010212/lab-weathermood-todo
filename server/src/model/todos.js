const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

function list(unaccomplishedOnly = false, searchText = ''){
    return new Promise((resolve, reject)=>{
        if(!fs.existsSync('data-todos.json')){
            fs.writeFileSync('data-todos.json', '');
        }
    
        fs.readFile('data-todos.json', 'utf8', (err, data)=>{
            if(err) reject(err);
    
            let todos = data ? JSON.parse(data) : [];
            if(todos.length > 0){
                if(unaccomplishedOnly){
                    todos = todos.filter((t)=>{
                        return !t.doneTs;
                        // return false;
                })}
                if(searchText){
                    todos = todos.filter((t)=>{
                        return t.text.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
                })}
            }
            resolve(todos);
        });
    });
}

function create(mood, text){
    return new Promise((resolve, reject)=>{
        const newTodo = {
            id: uuidv4(),
            mood: mood,
            text: text,
            ts: moment().unix(),
            doneTs: null,
        };

        list().then((todos)=>{
            todos = [newTodo, ...todos];
            fs.writeFile('data-todos.json', JSON.stringify(todos), (err)=>{
                if(err) reject(err);

                resolve(newTodo);
            });
        });
    });
}
function accomplish(todoId){
    console.log(todoId);
    return new Promise((resolve, reject)=>{
        let todo = null;
        list().then((todos)=>{
            todos = todos.map((t)=>{
                
                if(t.id===todoId){
                    todo = t;
                    t.doneTs = moment().unix();
                    
                }
                return t;
            });

            fs.writeFile('data-todos.json', JSON.stringify(todos), (err)=>{
                if(err) reject(err);
                console.log(`QAQ`);
                // console.log(todo.doneTs);
                resolve(todo);
            });
        });
    });
}

module.exports = {
    list,
    create,
    accomplish,
};