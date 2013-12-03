(function () {
    "use strict";

    var fs      = require("fs"),
        _       = require('underscore'),
        path    = require("path"),
        parents = require("parents");

    function getConfigFilePath(filePath){
    	var parentFolders = parents(path.dirname(filePath));
        var configFiles = _.map(parentFolders, function(folderPath){
        	return folderPath + path.sep + 'config.generator.json'
        });
        var configFilePath = _.find(configFiles, function(configFilePath){
        	return fs.existsSync(configFilePath);
        });

        if(!configFilePath){
        	throw new Error("Could not find config for \"" + filePath + "\"");
        }
        return configFilePath;
    };

    function validate(config, prop){
    	if(!config[prop])
    		throw new Error("Missing config value \""+ prop + "\" in \"" + filePath + "\"")
    }
    function createRegExp(regExpString){
        return new RegExp(regExpString);
    }
    module.exports = function(filePath){
    	var configFilePath = getConfigFilePath(filePath);
        var configString = fs.readFileSync(configFilePath, 'utf8');
        var config = JSON.parse(configString);

        validate(config, 'filenameValidators');
        validate(config, 'keepColorValidators');
        validate(config, 'outputFolder');

        config.filenameValidators = _.map(config.filenameValidators, createRegExp);
        config.keepColorValidators = _.map(config.keepColorValidators, createRegExp);
        config.outputFolder = path.join(path.dirname(configFilePath), config.outputFolder);

        return config;
    }
}());
