/**
 * Utilities and shared functionality for the build hooks.
 */
var fs = require('fs');
var path = require("path");
var cwd = path.resolve();
var modulesPath = path.resolve(cwd, "node_modules");
var configXmlPath = path.join(cwd, 'config.xml');

var elementTreeModule = require(path.resolve(modulesPath, "elementtree"));

fs.ensureDirSync = function (dir) {
    if (!fs.existsSync(dir)) {
        dir.split(path.sep).reduce(function (currentPath, folder) {
            currentPath += folder + path.sep;
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, '');
    }
};

module.exports = {

    //Get contents of config.xml file
    getConfigXmlData: function () {
        var contents = fs.readFileSync(configXmlPath, 'utf-8');
        if (contents) {
            contents = contents.substring(contents.indexOf('<'));
        }
        return new elementTreeModule.ElementTree(elementTreeModule.XML(contents));
    },

    getCotainerName: function (ios) {
        var preference;
        if (ios) {
            preference = this.getConfigXmlData().findall("preference[@name='GTMiOSContainerName']")[0];
        } else {
            preference = this.getConfigXmlData().findall("preference[@name='GTMAndroidContainerName']")[0];
        }

        if (preference) {
            return preference.attrib.value;
        } else {
            return null;
        }
    },
    copyContainer: function (platform, ios) {
        var containerName = this.getCotainerName(ios);
        var containerFile = cwd + "/www/" + containerName;
        if (this.fileExists(containerFile)) {
            try {
                var contents = fs.readFileSync(containerFile).toString();
                try {

                    fs.ensureDirSync(platform.container.dest);
                    var destination = platform.container.dest + "/" + containerName;
                    fs.writeFileSync(destination, contents);
                } catch (e) {
                    console.log(e);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Container file doesn't exists in projects root");
        }
    },
    copyKey: function (platform) {
        for (var i = 0; i < platform.src.length; i++) {
            var file = platform.src[i];
            if (this.fileExists(file)) {
                try {
                    var contents = fs.readFileSync(file).toString();

                    try {
                        platform.dest.forEach(function (destinationPath) {
                            var folder = destinationPath.substring(0, destinationPath.lastIndexOf('/'));
                            fs.ensureDirSync(folder);
                            fs.writeFileSync(destinationPath, contents);
                        });
                    } catch (e) {
                        // skip
                    }
                } catch (err) {
                    console.log(err);
                }

                break;
            }
        }
    },

    getValue: function (config, name) {
        var value = config.match(new RegExp('<' + name + '(.*?)>(.*?)</' + name + '>', 'i'));
        if (value && value[2]) {
            return value[2];
        } else {
            return null;
        }
    },

    fileExists: function (path) {
        try {
            return fs.statSync(path).isFile();
        } catch (e) {
            return false;
        }
    },

    directoryExists: function (path) {
        try {
            return fs.statSync(path).isDirectory();
        } catch (e) {
            return false;
        }
    }
};