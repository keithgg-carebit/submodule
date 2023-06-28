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
 * @file Defines tags to be added to jsdoc tag dictionary
 * @author James Reid
 */

// @ts-check

// @imports-package
// @ts-expect-error - jsdoc is an external runtime dependency
import env from "jsdoc/env"
// @imports-module
import { onTagged } from "./onTagged.js"

// @body
// jsdoc plugin handlers, see <https://jsdoc.app/about-plugins.html> for more 
// details
const handlers = {
    // set empty string environment variable at start and end of file parse
    fileBegin: () => { process.env.SUBMODULE = "" },
    fileComplete: () => { process.env.SUBMODULE = "" },
    // if "SUBMODULE" environment variable is set, add memberof tag to all jsdoc
    // comments in file according to value stored in environment variable (note
    // that it is not possible to add memberof tag to doclet on the "newDoclet"
    // event since comment scope value may be overridden given that without 
    // a memberof value, the doclet will be considered in global scope, and
    // therefore tags such as @inner will be ignored)
    jsdocCommentFound: (event) => {
        // ignore comments with existing memberof tags or single line comments
        if (event.comment.match(/@memberof/)) { return } 
        if (event.comment.match(/\/\*\*.*\*\//)) { return }
        if (process.env.SUBMODULE != "") { 
            // generate tagline and replace all trailing whitespace and end of 
            // comment characters with the generated tag
            const tag = ` * @memberof module:${process.env.SUBMODULE}`
            event.comment = event.comment.replace(/\s*\*\/$/, `\n${tag}\n */`)
        }
    }  
}

// standard tag definition for custom jsdoc plugin, see 
// <https://jsdoc.app/about-plugins.html> for more details
const defineTags = dictionary => {
    const options = {
        canHaveType: true, // allows type to be ignored
        canHaveName: true,
        isNamespace: false,
        mustHaveValue: false,
        mustNotHaveDescription: true,
        mustNotHaveValue: false
    }
    // define named tags with, onTagged function imported
    dictionary.defineTag("submodule", { 
        ...options, 
        onTagged: onTagged.bind(env) 
    })
    dictionary.defineTag("leafmodule", {
        ...options,
        onTagged: onTagged.bind({ ...env, leaf: true })
    })
}

// @exports
export { handlers, defineTags }