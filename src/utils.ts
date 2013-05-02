/// <reference path="references.ts" />
module tide
{
    // Internal import of fs module.
    var fs = require("fs");

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