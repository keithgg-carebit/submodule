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
 * @module plugin
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
 * Modify doclet to create a module tagged file with a name which follows the 
 * convention of naming a module according to relative dirname between the 
 * module file(s) and the root of the src directory for which jsdoc is creating 
 * documentation output.
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
    // set submodule configuration to an empty object if no configuration is 
    // supplied through jsdoc json config
    this.conf.submodule ??= {}

    /** 
     * Destructured jsdoc config fragment - onTagged callback in wrapping plugin
     * config object binds this function with the runtime environment variables
     * from jsdoc
     * @type {EnvFragment} 
     */
    const { pwd, conf: { submodule: { roots, ignore }, source } } = this

    // extract custom module root names from config and order them according to 
    // dirname length of the target directory in descending order, then add root
    // dirname(s) to tuples with no assigned custom prefix dirname
    const moduleTuples = Object.entries(roots || {}).sort((rootA, rootB) => {
        return rootB[1].split("/").length - rootA[1].split("/").length
    })
    for (const root of source.include) { moduleTuples.push(["", root]) }

    // calculate minimum relative nested dirname of doclet by iterating over 
    // module tuples, breaking if target dirname includes dirname of custom root
    // module
    let dirname = relative(pwd, doclet.meta.path)
    for (const tuple of moduleTuples) {
        const [rootName, rootDir] = tuple
        if (dirname.includes(rootDir)) {
            dirname = rootName != "" ? dirname.replace(rootDir, rootName)
                : dirname.replace(new RegExp(`${rootDir}\/?`), rootName)
            break
        }
    }
    
    // generate the complete slash-separated dirname for the nested module 
    // and convert the passed doclet into a jsdoc module doclet with the
    // calculated name
    const basename = doclet.meta.filename.match(/^.+(?=\..+$)/)[0] 
    const name = tag?.value?.name || (dirname === "" ? basename
        : (ignore || ["index"]).includes(basename) ? dirname
        : this.leaf ? dirname // use only dirname if leafmodule
        : `${dirname}/${basename}`) // attach basename if submodule
    Object.assign(doclet, { kind: "module", name })
}

// @exports
export { onTagged }