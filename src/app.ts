/// <reference path="framework/References.ts" />

{
    import fs = module("fs");
    console.log(fs.existsSync("d:\\test"));
}
/*
interface MyFunc { (x: number): void; }

var myDelegate = new EventHandler<MyFunc>();
myDelegate.Subscribe(function (x: number) { console.log("func1: %d", x); } );
myDelegate.Subscribe(function (x: number) { console.log("func2: %d", x); } );
myDelegate.Invoke(13);
*/