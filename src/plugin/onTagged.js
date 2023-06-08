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
 * Modifies doclet to create a module tagged file with a name which follows the 
 * convention of naming a module according to relative path between the module
 * file(s) and the root of the src directory for which jsdoc is creating 
 * documentation output
 * 
 * @summary Modify doclet to create module tagged file
 * @param {object} doclet - instance of doclet object created by jsdoc which
 *      contains the content of the comment block in which the given tag was 
 *      parsed
 * @param {object} tag - instance of tag object created by jsdoc which contains
 *      the parsed data of the tag which was found
 * @returns {void} function directly modifies the passed jsdoc doclet and its
 *      return value is not observed
 */
function onTagged(doclet, tag) { 
    /** 
     * Destructured jsdoc config fragment - onTagged callback in wrapping plugin
     * config object binds this function with the runtime environment variables
     * from jsdoc
     * @type {EnvFragment} 
     */
    const { pwd, conf: { submodule: { roots, ignore }, source } } = this

    // extract custom module root names from config and order them according to 
    // path length of the target directory in descending order, then add root
    // path(s) to tuples with no assigned custom prefix path
    const moduleTuples = Object.entries(roots || {}).sort((rootA, rootB) => {
        return rootB[1].split("/").length - rootA[1].split("/").length
    })
    for (const root of source.include) { moduleTuples.push(["", root]) }

    // calculate nested path of doclet by iterating over module tuples, breaking 
    // if target directory includes relative doclet path, favouring longest 
    // paths first due to ordering above
    let path = relative(pwd, doclet.meta.path)
    for (const tuple of moduleTuples) {
        const [rootName, rootPath] = tuple
        if (path.includes(rootPath)) {
            path = rootName != "" ? path.replace(rootPath, rootName)
                : path.replace(new RegExp(`${rootPath}\/?`), rootName)
            break
        }
    }
    
    // generate the complete slash-separated pathname for the nested module 
    // and convert the passed doclet into a jsdoc module doclet with the
    // calculated name
    const basename = doclet.meta.filename.match(/^.+(?=\..+$)/)[0] 
    const name = tag?.value?.name || (path === "" ? basename
        : (ignore || ["index"]).includes(basename) ? path
        : `${path}/${basename}`)
    Object.assign(doclet, { kind: "module", name })
}

// @exports
export { onTagged }