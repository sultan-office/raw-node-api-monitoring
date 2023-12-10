/*
 * Title: Data Library
 * Description: Data Library for CRUD
 * Developer: Ah Sultan
 * Date: 07/Dec/2023
 *
 */

const path = require("path");
const fs = require("fs");

// Module Scaffolding
const lib = {};

// Base Directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/");

// write data to file
lib.write = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err1, fileDescriptor) => {
    if (!err1 && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("error: File Not Closed");
            }
          });
        } else {
          callback("error  writing to new file");
        }
      });
    } else {
      callback("There was an error, file may be already exist!");
    }
  });
};


// Read Data of File
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// Update file data
lib.update = (dir, file, data, callback) => {
  const stringData = JSON.stringify(data);

  // Open File --
  fs.open(
    `${lib.basedir + dir}/${file}.json`,
    "r+",
    (err1, fileDescriptor) => {
      if (!err1 && fileDescriptor) {
        // Truncate File
        fs.ftruncate(fileDescriptor, (err2) => {
          if (!err2) {
            // write File and close it
            fs.writeFile(fileDescriptor, stringData, (err3) => {
              if (!err3) {
                // close File
                fs.close(fileDescriptor, (err4) => {
                  if (!err4) {
                    callback(false);
                  } else {
                    callback("Error: File Not Close");
                  }
                });
              } else {
                callback("Error: file not write");
              }
            });
          } else {
            callback("Error to truncating file");
          }
        });
      } else {
        callback("Error: This file may not exists");
      }
    }
  );
};

// Delete File from data
lib.delete = (dir, file, callback) => {
    // Delete File
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err1) => {
        if(!err1){
            callback(false)
        }else{
            callback("Error: File not delete successfully ")
        }

    })
}

module.exports = lib;
