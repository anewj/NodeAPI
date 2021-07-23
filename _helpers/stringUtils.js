function objectValueToUpper(obj, ...keys){
    keys.forEach((key)=>{
        if(obj[key]){
            obj[key] = obj[key].toUpperCase();
        }
    });
    return obj;
}

module.exports = {
    objectValueToUpper
}