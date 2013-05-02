/// <reference path="../definitions/DefinitelyTyped/ace/ace.d.ts" />
/// <reference path="../definitions/DefinitelyTyped/node/node.d.ts" />
/// <reference path="../definitions/DefinitelyTyped/async/async.d.ts" />
/// <reference path="../definitions/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../definitions/DefinitelyTyped/knockout/knockout.d.ts" />
/// <reference path="../definitions/DefinitelyTyped/bootstrap/Bootstrap.d.ts" />
/// <reference path="../definitions/DefinitelyTyped/knockout.mapping/knockout.mapping.d.ts" />

import fs = module("fs");

module tide
{
    // --------------------------------------------------------------------------------------------------------------
    //                                              Exceptions
    // --------------------------------------------------------------------------------------------------------------

    /** Represents an exception. */
    export class Exception
    {
        private _message: string;
        private _innerException: Exception;

        /** Gets the exception message. */
        public get Message() { return this._message; }
        /** Gets the inner exception, if any. */
        public get InnerException() { return this._innerException; }

        // Constructor.
        constructor (message: string, innerException: Exception = null)
        {
            this._message = message;
            this._innerException = innerException;
        }

        /** Returns a string describing the exception. */
        public toString(): string
        {
            if (this._innerException)
                return this._message + "\nInner Exception: " + this._innerException;
            else
                return this._message;
        }
    }

    /** Represents an "argument is invalid" exception. */
    export class ArgumentException extends Exception
    {
        private _argumentName: string;

        /** Gets the name of the argument that caused the exception. */
        public get ArgumentName() { return this._argumentName; }

        // Constructor.
        constructor (argumentName: string, message: string = "")
        {
            super("Invalid argument: " + argumentName + (message == "" ? "" : ", " + message), null);
            this._argumentName = argumentName;
        }
    }

    /** Represents an "argument is null" exception. */
    export class ArgumentNullException extends ArgumentException
    {
        // Constructor.
        constructor (argumentName: string)
        {
            super(argumentName, "unexpected null value");
        }
    }

    /** Represents an "argument is out of range" exception. **/
    export class ArgumentOutOfRangeException extends ArgumentException
    {
        // Constructor.
        constructor (argumentName: string)
        {
            super(argumentName, "argument is out of range");
        }
    }

    /** Represents an "invalid operation" exception. */
    export class InvalidOperationException extends Exception
    {
        // Constructor.
        constructor (message: string, innerException: Exception = null)
        {
            super("Invalid operation: " + message, innerException);
        }
    }

    // --------------------------------------------------------------------------------------------------------------
    //                                              EventHandler
    // --------------------------------------------------------------------------------------------------------------

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

    // --------------------------------------------------------------------------------------------------------------
    //                                              Utils
    // --------------------------------------------------------------------------------------------------------------

    /** Contains utility methods. */
    export class Utils
    {
        /** Returns the parent culture of specified culture, or null if it's a root culture. */
        public static GetParentCulture(culture: string): string
        {
            if (culture === null) throw new ArgumentNullException("culture");
            var cultureRegex = new RegExp("^([a-zA-Z]+)\\-([a-zA-Z]+)$", "gi");
            var match = cultureRegex.exec(culture);
            if (match) return match[1];
            else return null;
        }

        /** Returns the name of specified file without extension. */
        public static GetFileNameWithoutExtenstion(path: string): string
        {
            return path.replace(/([\/\\]*[^\/\\]+[\/\\])*([^\.\/\\]+)(\.[^\.\/\\]+)*/ig, "$2");
        }

        /** Reads the content of specified file as a string. */
        public static ReadFileContent(path: string, encoding: string = "utf-8"): string
        {
            if (path === null) throw new ArgumentNullException("path");
            if (encoding === null) throw new ArgumentNullException("encoding");
            var content = fs.readFileSync(path, encoding);
            if (encoding == "utf-8" && content.charAt(0) === '\uFEFF')
                content = content.substr(1);
            return content;
        }

        /** Escapes regexp characters from specified string. */
        public static EscapeRegExpString(s: string): string
        {
            return s.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        }

        /** Converts a wildcard string into a regular expression. */
        public static WildcardToRegExpString(wildcard: string): string
        {
            wildcard = Utils.EscapeRegExpString(wildcard);
            wildcard = wildcard.replace("\\*", ".*");
            return wildcard;
        }

        /** Returns an array of file names in specified folder satisfying specified mask. */
        public static GetFilesInFolder(path: string, mask: string, recursive: bool = true): string[]
        {
            if (path === null) throw new ArgumentNullException("path");
            if (mask === null) throw new ArgumentNullException("mask");
            var files = fs.readdirSync(path);
            var filtered = <string[]>[];
            for (var i = 0; i < files.length; i++)
            {
                var fileInfo = fs.statSync(path + '/' + files[i]);
                if (fileInfo.isFile())
                {
                    var regex = new RegExp("^" + Utils.WildcardToRegExpString(mask) + "$", "gi");
                    if (regex.test(files[i]))
                        filtered.push(files[i]);
                }
                else if (fileInfo.isDirectory() && recursive)
                    {
                    var subfiles = Utils.GetFilesInFolder(path + '/' + files[i], mask);
                    for (var j = 0; j < subfiles.length; j++)
                        filtered.push(files[i] + '/' + subfiles[j]);
                }
            }
            return filtered;
        }

        /** Converts a string into a DOM DocumentFragment object. */
        public static StringToDocumentFragment(s: string): DocumentFragment
        {
            if (s === null) throw new ArgumentNullException("s");
            var d = document.createElement('div');
            d.innerHTML = s;
            var docFrag = document.createDocumentFragment();
            while (d.firstChild)
            {
                docFrag.appendChild(d.firstChild)
            };
            return docFrag;
        }
    }

}