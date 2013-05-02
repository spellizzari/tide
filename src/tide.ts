/// <reference path="references.ts" />
module tide
{
    interface MyFunc { (x: number): void; }

    /** The application's entry point. */
    export function Run()
    {
        var myDelegate = new tide.EventHandler<MyFunc>();
        myDelegate.Subscribe(function (x: number) { console.log("func1: %d", x); } );
        myDelegate.Subscribe(function (x: number) { console.log("func2: %d", x); } );
        myDelegate.Invoke(13);
    }
}
tide.Run();