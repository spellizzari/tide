/// <reference path="../references.ts" />
module tide
{
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
}