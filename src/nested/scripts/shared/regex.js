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
 * @file Defines regexps required for parsing the existing nav into a module 
 *      tree
 * @module shared/regex
 * @author James Reid
 */

// @ts-check

// @body
/**
 * Module regex
 * 
 * @type {RegExp}
 */
const moduleRegex = /(?<=\/module-).*(?=\.html)/
const absolutePath = `_${window.location.href.match(moduleRegex)?.[0] || ""}`

const methodRegex = /(?<=\/module-).*(?=\.html#)/
const rootPathRegex = /^_[^_]*$/
const childPathRegex = new RegExp(`^${absolutePath}${/_[^_]*$/.source}`)

let siblingPathRegex = /(^_[^_]*$)/
let siblingScopePath = ""
for (const scope of absolutePath.split("_").slice(1)) {
    siblingScopePath = `${siblingScopePath}_${scope}`
    const regex = new RegExp(`(^${siblingScopePath}${/_[^_]*$/.source})`)
    siblingPathRegex = new RegExp(`${siblingPathRegex.source}|${regex.source}`)
}

const accessRegex = /(?<access>(public|package|protected|private))/
const scopeRegex = /(?<scope>(global|instance|static|inner))/
const methodSignatureRegex = new RegExp(
    `(\\()?${accessRegex.source}?(,\\s)?${scopeRegex.source}?(\\))?`, "i"
)

// @exports
export { 
    moduleRegex,
    methodRegex,
    rootPathRegex,
    childPathRegex,
    siblingPathRegex,
    methodSignatureRegex,
    absolutePath
}