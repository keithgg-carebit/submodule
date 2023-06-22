// Copyright (c) 2022 James Reid. All rights reserved.
//
// This source code file is licensed under the terms of the MIT license, a copy
// of which may be found in the LICENSE.md file in the root of this repository.  
// 
// For a template copy of the license see one of the following 3rd party sites:
//      - <https://opensource.org/licenses/MIT>
//      - <https://choosealicense.com/licenses/mit>
//      - <https://spdx.org/licenses/MIT>

// @ts-check

/**
 * @file NestedModule type declaration
 * @author James Reid
 */

// @body
/**
 * Object format of data parsed from existing module nav element, each link in
 * the existing module nav element will produce one NestedModule object, which 
 * will be nested together with all other NestedModules through the 
 * NestedModule.children arrays to form a tree like structure which may be 
 * used to re-render the module nav reflective of src directory.
 * 
 * @summary Object format of data parsed from existing module nav element
 * @tutorial module-fragments
 * @typedef {object} NestedModule
 * @property {string} name - Basename of module or member etc.
 * @property {string} href - Link of module or member etc. as used in the jsdoc
 *      autogenerated output; all links are top level
 * @property {"namespace-module"|"module"|"file"|"method"} type - Type of 
 *      fragment - i.e. a submodule/file/method contained within a submodule 
 *      file
 * @property {"selected"|"parent"|"child"|"sibling"|"hidden"} hierarchy - 
 *      Relative path relation to current selected submodule (i.e. child, 
 *      sibling, parent etc.), used to determine how this submodule should be 
 *      rendered (hidden, nested right etc.)
 * @property {string} path - Dirname of module or member etc.
 * @property {NestedModule[]} children - Array of submodules which are children
 *      of this given submodule
 * @property {string} [access] - Access of member if it is a method
 * @property {string} [scope] - Scope of member if it is a method
 */

// @exports
/**
 * @ignore
 * @type {NestedModule} 
 */
export let NestedModule