(function ()
{
    var exports = {};

    var fs = require("fs");
    var path = require("path");

    // Creates a regex for specified wildcard pattern.
    function wildcardToRegex(pattern)
    {
        function preg_quote(str, delimiter)
        {
            // http://kevin.vanzonneveld.net
            // +   original by: booeyOH
            // +   improved by: Ates Goral (http://magnetiq.com)
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   bugfixed by: Onno Marsman
            // +   improved by: Brett Zamir (http://brett-zamir.me)
            // *     example 1: preg_quote("$40");
            // *     returns 1: '\$40'
            // *     example 2: preg_quote("*RRRING* Hello?");
            // *     returns 2: '\*RRRING\* Hello\?'
            // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
            // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
            return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
        }
        var parts = pattern.split(";");
        var patterns = parts.map(function (part) { return '(?:' + preg_quote(part).replace(/\\\*/g, '.*').replace(/\\\?/g, '.') + ')'; });
        return new RegExp(patterns.join('|'), 'g');
    }
    exports.wildcardToRegex = wildcardToRegex;

    // Looks for files in specified directory matching specified regex.
    // Returns an array of paths.
    function findFilesFromRegex(dir, regex)
    {
        var dirContent = fs.readdirSync(dir);
        var result = new Array();
        for (var i = 0; i < dirContent.length; i++)
        {
            var element = dirContent[i];
            var elementPath = dir + "/" + element;
            var elementStat = fs.statSync(elementPath);
            if (elementStat.isDirectory()) // If it's a directory...
            {
                var result2 = findFilesFromRegex(elementPath, regex);
                result = result.concat(result2);
            }
            else if (regex.test(element))
            {
                result.push(elementPath);
            }
        }
        return result;
    }
    exports.findFilesFromRegex = findFilesFromRegex;

    // Looks for files in specified directory matching specified wildcard pattern.
    // Returns an array of paths.
    function findFilesFromWildcard(dir, pattern)
    {
        return findFilesFromRegex(dir, wildcardToRegex(pattern));
    }
    exports.findFilesFromWildcard = findFilesFromWildcard;

    // Replaces slashes with path delimiter.
    function toSystemPath(str)
    {
        return str.replace(/\//g, path.sep);
    }
    exports.toSystemPath = toSystemPath;

    // Executes a shell command and runs specified callback.
    // Slashes are replaced with plaform path separator on output in order for tools like Visual Studio to understand paths in messages.
    function executeAsync(cmds, callback)
    {
        var exec = jake.createExec(cmds);
        exec.addListener('cmdStart', function (cmd) { console.log(toSystemPath(cmd)); });
        exec.addListener('cmdEnd', function (cmd) { callback(); });
        exec.addListener('stdout', function (data) { process.stdout.write(toSystemPath(data.toString())); });
        exec.addListener('stderr', function (data) { process.stderr.write(toSystemPath(data.toString())); });
        exec.addListener('error', function (msg, code) { process.exit(code); });
        exec.run();
    }
    exports.executeAsync = executeAsync;

    // Deletes specified file or folder.
    function deleteFileOrFolder(path)
    {
        var stat = fs.statSync(path);
        if (stat.isDirectory())
        {
            var content = fs.readdirSync(path);
            for (var i = 0; i < content.length; i++)
                deleteFileOrFolder(path + "/" + content[i]);
            console.log("Deleting %s/", path);
            fs.rmdirSync(path);
        }
        else
        {
            console.log("Deleting %s", path);
            fs.unlinkSync(path);
        }
    }
    exports.deleteFileOrFolder = deleteFileOrFolder;

    // Creates a folder recursively.
    function createFolder(dirpath)
    {
        if (!fs.existsSync(dirpath))
        {
            var parentPath = path.dirname(dirpath);
            createFolder(parentPath);
            console.log("Creating %s/", dirpath);
            fs.mkdirSync(dirpath);
        }
    }
    exports.createFolder = createFolder;

    var BUF_LENGTH = 64 * 1024;
    var _buff = new Buffer(BUF_LENGTH);

    // Copies a file synchronously.
    function copyFileSync(srcFile, destFile)
    {
        var bytesRead, fdr, fdw, pos;
        fdr = fs.openSync(srcFile, 'r');
        fdw = fs.openSync(destFile, 'w');
        bytesRead = 1;
        pos = 0;
        while (bytesRead > 0)
        {
            bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
            fs.writeSync(fdw, _buff, 0, bytesRead);
            pos += bytesRead;
        }
        fs.closeSync(fdr);
        return fs.closeSync(fdw);
    }
    exports.copyFileSync = copyFileSync;

    // Synchronizes files in specified folders.
    function synchronizeFoldersRegex(srcDir, dstDir, regex)
    {
        // List the content of both directories.
        var dstDirExists = fs.existsSync(dstDir);
        var srcDirContent = fs.readdirSync(srcDir);

        // Copy files and folders in source folder that are more recent than those in destination folder.
        for (var i = 0; i < srcDirContent.length; i++)
        {
            var srcElementName = srcDirContent[i];
            var srcElementPath = srcDir + "/" + srcElementName;
            var dstElementPath = dstDir + "/" + srcElementName;
            var srcElementStat = fs.statSync(srcElementPath);
            if (srcElementStat.isDirectory())
            {
                synchronizeFoldersRegex(srcElementPath, dstElementPath, regex);
            }
            else
            {
                if (regex.test(srcElementName))
                {
                    var mustCopy = true;
                    if (!dstDirExists)
                    {
                        createFolder(dstDir);
                        dstDirExists = true;
                    }
                    else
                    {
                        if (fs.existsSync(dstElementPath))
                        {
                            var dstElementStat = fs.statSync(dstElementPath);
                            var srcElementMTime = srcElementStat.mtime.valueOf();
                            var dstElementMTime = dstElementStat.mtime.valueOf();
                            if (dstElementMTime == srcElementMTime)
                                mustCopy = false;
                        }
                    }

                    if (mustCopy)
                    {
                        console.log("Copying %s", dstElementPath);
                        copyFileSync(srcElementPath, dstElementPath);
                        fs.utimesSync(dstElementPath, srcElementStat.atime, srcElementStat.mtime);
                    }
                }
            }
        }
    }
    exports.synchronizeFoldersRegex = synchronizeFoldersRegex;

    // Synchronizes files in specified folders.
    function synchronizeFoldersWildcard(srcDir, dstDir, pattern)
    {
        synchronizeFoldersRegex(srcDir, dstDir, wildcardToRegex(pattern));
    }
    exports.synchronizeFoldersWildcard = synchronizeFoldersWildcard;

})();