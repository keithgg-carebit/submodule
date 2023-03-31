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
// @imports-package
// @ts-expect-error - jsdoc is an external runtime dependency
import env from "jsdoc/env"

// @body
/**
 * Fragment of generated jsdoc environment object containing required fields to 
 * parse submodule tag
 * 
 * @typedef EnvFragment
 * @property {string} pwd - directory of package.json/npm run <script> command
 * @property {object} conf - 
 * @property {object} conf.submodule - submodule plugin-specific config object
 * @property {Object.<string, string>} conf.submodule.roots - custom defined 
 *      module names
 * @property {string[]} conf.submodule.nullBases - ignored filenames
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
const onTagged = (doclet, tag) => { 
    /** @type {EnvFragment} */
    const { pwd, conf: { submodule, source } } = env // destructure jsdoc config
    
    const moduleTuples = Object.entries(submodule.roots || {}).sort((a, b) => {
        return b[1].split("/").length - a[1].split("/").length
    })
    for (const root of source.include) { moduleTuples.push(["", root]) }

    let path = relative(pwd, doclet.meta.path)
    for (const tuple of moduleTuples) {
        const [rootName, rootPath] = tuple
        if (path.includes(rootPath)) {
            path = path.replace(rootPath, rootName)
            break
        }
    }
    
    const basename = doclet.meta.filename.match(/^.+(?=\..+$)/)[0] 
    const name = tag?.value?.name || (path === "" ? basename
        : (submodule?.nullBases || ["index"]).includes(basename) ? path
        : `${path}/${basename}`)
    Object.assign(doclet, { kind: "module", name })
}

// @exports
export { onTagged }