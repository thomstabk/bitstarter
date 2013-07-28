#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

To execute, make executable and specify files
npm install cheerio
npm install commander
chmod a+x grader.js
./grader.js --checks checks.json --file index.html
*/



var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLFILE_DEFAULT = "http://sheltered-lake-3072.herokuapp.com";

var assertURLExists = function(url) {
  rest.get(url).on('complete', function(results) {
    if (results instanceof Error) {
      console.log('Error getting url' + results.message);
    } else {
      fs.writeFile("/tmp/test.html", results, function(err, buffer) {
        if (err instanceof Error) {
           console.log("There was a write error" + err);
        } else {
          console.log("The file was saved!");
        }
      }); 
    }
  });
//THIS PART DOES NOT WORK YET
  var instr = fs.readFileSync("test.html").toString;
  return instr; 
};

var assertFileExists = function(infile) {
  var instr = infile.toString();
  if(!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
  }
  return instr;
};

var cheerioHtmlFile = function(htmlfile) {
  return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
  $ = cheerioHtmlFile(htmlfile);
  var checks = loadChecks(checksfile).sort();
  var out = {};
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  return out;
};

var clone = function(fn) {
  // Workaround for commander.js issue.
  // http://stackoverflow.com/a/6772648
  return fn.bind({});
};

if(require.main == module) {
    program
            .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
            .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	    .option('-u, --url <url_file>', 'Path to url', clone(assertURLExists), URLFILE_DEFAULT)
            .parse(process.argv);
  var checkJson = checkHtmlFile(program.file, program.checks);
  var outJson = JSON.stringify(checkJson, null, 4);
  console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile
}
