require("shelljs/make.js");

target.clean = function()
{
    // Cleanup output folders.
    rm("-rf", "./lib/*");
    rm("-rf", "./bin/application/*");
}

target.build = function()
{
    // Compile typescript module.
    exec("tsc --module commonjs --comments --declaration --sourcemap --target ES5 --out ./lib/tide.js ./src/tide.ts");

    // Copy javascript files to application folder.
    cp("-f", "./lib/*.js*", "./bin/application/");
}

target.rebuild = function()
{
    // Clean and build.
    target.clean();
    target.build();
}
