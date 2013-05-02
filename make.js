require("shelljs/make.js");

target.clean = function()
{
    // Cleanup output folders.
    echo("Cleaning up...");
    rm("-rf", "./lib/*");
    rm("-rf", "./bin/application/*");
}

target.build = function()
{
    // Compile typescript module.
    echo("Compiling...");
    exec("tsc --module commonjs --comments --declaration --sourcemap --target ES5 --out ./lib/tide.js ./src/tide.ts");

    // Copy javascript files to application folder.
    echo("Copying compiled files...");
    cp("-f", "./lib/*.js*", "./bin/application/");
}

target.rebuild = function()
{
    // Clean and build.
    target.clean();
    target.build();
}
