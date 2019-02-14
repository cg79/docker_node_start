module.exports = function() {
    var logMethods = {
        log: function(obj) {
            //get user favorite services
            console.log(obj);
        },
        error:function(obj)
        {
        	console.log(JSON.stringify(obj));
        },
        logObj:function(obj)
        {
            console.log(JSON.stringify(obj));
        }
    }

    return logMethods;
}
