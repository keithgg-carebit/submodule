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
 * @file Docdash nested module entry point
 * @module docdash
 * @author James Reid
 */

// @ts-check

// @imports-style
import "../../styles/docdash.css"
// @imports-local
import { renderNestedModules, renderNestedTitle } from "../shared/render.js"
// @imports-module
import { mountNav, mountTitle } from "./mount.js"
import { parseModules } from "./parse.js"

// @body
try {
    // mount nav and title (module nav list may not exist and may throw error)
    const { navList, moduleNavContainer } = mountNav()
    const title = mountTitle()
    
    // parse existing module nav list into a nested module tree
    const moduleTree = parseModules(navList)
    
    // re-render nav and title
    renderNestedModules(moduleNavContainer, moduleTree)
    renderNestedTitle(title)
} 
catch (error) { console.error(error) }
