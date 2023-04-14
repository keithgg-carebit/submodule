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
 * @file Defines onTagged function for shorthand nested module tagged files
 * @module tag
 * @author James Reid
 */

// @ts-check

// @imports-node
import { relative } from "path"

// @body
/**
 * Fragment of generated jsdoc environment object containing required fields to 
 * parse submodule tag
 * 
 * @typedef EnvFragment
 * @property {string} pwd - directory of package.json/npm run <script> command
 * @property {object} conf - ref to jsdoc config file used in cli command
 * @property {object} conf.submodule - submodule plugin-specific config object
 * @property {Object.<string, string>} conf.submodule.roots - custom defined 
 *      module names
 * @property {string[]} conf.submodule.ignore - ignored filenames
 * @property {{include: string[]}} conf.source - jsdoc source value
 */

/**
 * Insert function description
 * 
 * @summary Modify doclet to create module tagged file
 * @param {object} doclet - instance of doclet object created by jsdoc which
 *      contains the content of the comment block in which the given tag was 
 *      parsed
 * @param {object} tag - instance of tag object created by jsdoc which contains
 *      the parsed data of the tag which was found
 * @returns {void}
 */
function onTagged(doclet, tag) { 
    /** 
     * Destructured jsdoc config fragment 
     * @type {EnvFragment} 
     */
    const { pwd, conf: { submodule: { roots, ignore }, source } } = this

    const moduleTuples = Object.entries(roots || {}).sort((rootA, rootB) => {
        return rootB[1].split("/").length - rootA[1].split("/").length
    })
    for (const root of source.include) { moduleTuples.push(["", root]) }

    let path = relative(pwd, doclet.meta.path)
    for (const tuple of moduleTuples) {
        const [rootName, rootPath] = tuple
        if (path.includes(rootPath)) {
            path = rootName != "" ? path.replace(rootPath, rootName)
                : path.replace(new RegExp(`${rootPath}\/?`), rootName)
            break
        }
    }
    
    const basename = doclet.meta.filename.match(/^.+(?=\..+$)/)[0] 
    const name = tag?.value?.name || (path === "" ? basename
        : (ignore || ["index"]).includes(basename) ? path
        : `${path}/${basename}`)
    Object.assign(doclet, { kind: "module", name })
}

// @exports
export { onTagged }