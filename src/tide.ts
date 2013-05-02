/// <reference path="references.ts" />
module tide
{
    /** The application's entry point. */
    export function Run()
    {
        var myDelegate = new EventHandler<(x: number) => void>();
        myDelegate.Subscribe((x: number) => console.log("func1: %d", x));
        myDelegate.Subscribe((x: number) => console.log("func2: %d", x));
        myDelegate.Invoke(13);
    }
}
tide.Run();