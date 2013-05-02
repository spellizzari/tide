var fs = require("fs");
var path = require("path");
var jaketools = require("./Jaketools");

task("clean", function (params)
{
});

task("build", {async: true}, function (params)
{
    try
    {
        // Compile the tide module.
        executeAsync("tsc --module commonjs --comments --declaration --sourcemap --target ES5 --out ./lib/ ./src/tide.js",
            function ()
            {
                // Compile the tide module.
                executeAsync("tsc --module commonjs --comments --declaration --sourcemap --target ES5 --out ./lib/ ./src/tide.js",
                    function ()
                    {
                        complete();
                    });
            });
    }
    catch (err)
    {
        console.log("EXCEPTION:");
        console.log(err);
    }
});

task("rebuild", function (params)
{
    jake.Task["clean"].invoke();
    jake.Task["build"].invoke();
});
