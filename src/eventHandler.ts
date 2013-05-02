/// <reference path="references.ts" />
module tide
{
    /** Represents an aggregate of functions invoked in order. */
    export class EventHandler<TFunc extends Function>
    {
        private _functions: TFunc[] = [];    // The array of functions.

        // Adds specified function to the list of subscribed functions.
        public Subscribe(handler: TFunc)
        {
            if (handler === null) throw new ArgumentNullException("handler");
            this._functions.push(handler);
        }

        // Removes specified function from the list of subscribed functions.
        public Unsubscribe(handler: TFunc)
        {
            if (handler === null) throw new ArgumentNullException("handler");
            var index = this._functions.indexOf(handler);
            if (index != -1)
                this._functions.splice(index, 1);
        }

        // Invokes all the handlers in the delegate.
        public Invoke(...args: any[])
        {
            for (var i = 0; i < this._functions.length; i++)
                this._functions[i].call(null, args);
        }
    }
}