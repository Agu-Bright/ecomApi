const deepCopy = (obj)=>{
    //check if values are objects
    //if so, copy that object(deepCopy)
    //else, return the value
    let keys = Object.keys(obj) //returns an array of object keys
    const newObject = {}
    for (let i = 0; i <= keys.length; i++){
        const key = keys[i]
        if(typeof obj[key] === 'object'){
            newObject[key] = deepCopy(obj[key])
        }else{
            newObject[key] = obj[key]
        }
    }
    return Object.assign({}, obj)
}

function map(arr, fn){
    const newArray = []
    for (let i = 0; i < arr.length; i++){
        let val = arr[i]
        newArray.push(fn(val))
    }
    return newArray
}

//hang functin for fun
function hang(sec){
    const doneAt = Date.now() + (sec * 1000)
    while(Date.now() < doneAt){}
}