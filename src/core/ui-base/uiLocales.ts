/// <reference path="../references.ts" />
module tide
{
    /** Represents the UI localization manager. */
    export class UILocales
    {
        // (string) => (string) => (string)
        private _locales: Object = new Object();

        //=======================================================================
        //     Properties
        //=======================================================================

        public CurrentCulture: string = "fr";
        public DefaultCulture: string = "en";

        //=======================================================================
        //     Methods
        //=======================================================================

        // Imports locales defined in specified XML file.
        public Import(path: string, encoding: string = "utf-8"): void
        {
            if (!path) throw new ArgumentNullException("path");
            if (!encoding) throw new ArgumentNullException("encoding");

            // Read the file content.
            var content = Utils.ReadFileContent(path, encoding);

            // Parse XML content.
            var xmlParser = new marknote.Parser();
            var xmlDocument = xmlParser.parse(content);

            // Get the root element.
            var xmlRoot = xmlDocument.getRootElement();
            if (xmlRoot.getName() != "Locales") throw new Exception("Invalid XML locales document");

            // Parse content.
            var xmlChildren = xmlRoot.getChildElements();
            for (var i = 0; i < xmlChildren.length; i++)
            {
                var xmlElement = xmlChildren[i];
                var name = xmlElement.getName();
                var xmlElementChildren = xmlElement.getChildElements();
                for (var j = 0; j < xmlElementChildren.length; j++)
                {
                    var xmlElement2 = xmlElementChildren[j];
                    if (!(name in this._locales))
                        this._locales[name] = new Object();
                    this._locales[name][xmlElement2.getName().toLowerCase()] = xmlElement2.getText();
                }
            }
        }

        // Imports every file in specified path satisfying specified pattern as locales files.
        public ImportFolder(path: string, pattern: string): void;
        public ImportFolder(path: string, pattern: string, encoding: string = "utf-8"): void;
        public ImportFolder(path: string, pattern: string, encoding: string = "utf-8"): void
        {
            if (path === null) throw new ArgumentNullException("path");
            if (pattern === null) throw new ArgumentNullException("pattern");
            if (encoding === null) throw new ArgumentNullException("encoding");

            // Get all the files in the folder.
            var files = Utils.GetFilesInFolder(path, pattern);

            // Import them.
            for (var i = 0; i < files.length; i++)
                this.Import(path + "/" + files[i], encoding);
        }

        // Returns the text definition for specified culture.
        // The culture parameter must be lower case.
        public Get(id: string, culture: string = null): string
        {
            if (!id) throw new ArgumentNullException("id");

            if (!culture) culture = this.CurrentCulture;
            if (!(id in this._locales))
                return id;
            var defs = this._locales[id];
            for (; ;)
            {
                if (culture in defs)
                    return defs[culture];
                culture = Utils.GetParentCulture(culture);
                if (!culture)
                {
                    if (this.DefaultCulture in defs)
                        return defs[this.DefaultCulture];
                    else
                        return id;
                }
            }
        }
    }
}