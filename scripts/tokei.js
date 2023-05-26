// Copyright (c) 2022 James Reid. All rights reserved.
//
// This source code file is licensed under the terms of the MIT license, a copy
// of which may be found in the LICENSE.md file in the root of this repository.  
// 
// For a template copy of the license see one of the following 3rd party sites:
//      * <https://opensource.org/licenses/MIT>
//      * <https://choosealicense.com/licenses/mit>
//      * <https://spdx.org/licenses/MIT>

/**
 * @ignore
 * @file Counts approximate lines of code written by the author
 * @author James Reid
 */

// @ts-check

// @imports-node
import { exec } from "child_process"
import fs from "fs"

// @body
// count lines of code using tokei - note that this uses the "tokei" command
// which is a cli application written in rust, this script will not run without
// tokei being installed on the system
// for information on installing and configuring tokei, please see here
// https://github.com/XAMPPRocky/tokei
exec("tokei --output json", (error, stdout, stderr) => {
    // return errors if any
    if (error) { return console.error(`exec error: ${error}`) }
    if (stderr) { return console.error(`stderr: ${stderr}`) }
    
    // fetch total line counts from tokei json output
    const { blanks, code, comments } = JSON.parse(stdout)["Total"]
    const lineCount = blanks + code + comments

    // create shields endpoint object according to the available options and 
    // defaults found here https://shields.io/endpoint
    const data = {
        schemaVersion: 1,
        label: "lines written",
        message: lineCount.toString(),
        style: "for-the-badge",
        labelColor: "181b1a", // left color
        color: "779966" // right color
    }
    
    // save endpoint to dist dir and log total line count
    fs.writeFileSync("./dist/tokei.json", JSON.stringify(data))
    return console.log(`\nlines of code: ${lineCount}`)
})