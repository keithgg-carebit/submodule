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
 * @file Defines shared render method for the nested nav given a mount supplied
 *      mount point
 * @module shared/render
 * @author James Reid
 */

// @ts-check

// @imports-style
import "../../styles/style.css"
// @imports-module
import { absolutePath } from "./regex.js"
// @imports-type
import { NestedModule } from "../../types/NestedModule.js"

// @body
/**
 * Render nested module nav to a target container within the original jsdoc
 * template nav. Nesting determined by moduleTree reflecting the code/module
 * structure.
 * 
 * @summary Render nested module nav
 * @param {HTMLElement} moduleNavContainer - target html element for rendering 
 *      nested module nav
 * @param {NestedModule[]} moduleTree - calculated module tree to re-render in
 *      a nested format
 * @returns {void} function directly renders to the passed moduleNavContainer html
 *      element, and return value is not observed
 */
const renderNestedModules = (moduleNavContainer, moduleTree) => {
    const list = document.createElement("ul")
    let scope
    for (const fragment of moduleTree) {
        if (fragment.scope && scope != fragment.scope) {
            scope = fragment.scope
            const title = document.createElement("li")
            title.classList.add("method-title")
            title.innerHTML = fragment.scope 
                ? `${fragment.scope} methods` 
                : "submodules"
            title.innerHTML = `${fragment.scope} methods`
            list.appendChild(title)
        }
        const listItem = document.createElement("li")
        listItem.dataset.type = fragment.type
        listItem.classList.add(...(() => {
            const { type, hierarchy, access, scope } = fragment
            const classList = [type, hierarchy]
            if (access && scope) { 
                classList.push(`access-${access}`, `scope-${scope}`) 
            }
            return classList
        })())
        const link = document.createElement("a")
        link.innerHTML = fragment.name
        link.href = fragment.href
        listItem.appendChild(link)
        
        if (fragment.children.length) { 
            renderNestedModules(listItem, fragment.children) 
        }
        list.appendChild(listItem)
    }
    moduleNavContainer.appendChild(list)
}

/**
 * 
 * @param {HTMLHeadingElement} title 
 * @returns {void}
 */
const renderNestedTitle = title => {
    if (absolutePath != "_") {
        const splitPath = absolutePath.split("_").slice(1)
        const [last, init] = [ 
            /** @type {string} */ (splitPath.pop()), 
            splitPath 
        ]
        const spanInit = document.createElement("span")
        spanInit.innerHTML = init.length ? `${init.join(" → ")} → ` : ""
        const spanLast = document.createElement("span")
        spanLast.innerHTML = last

        title.innerHTML = ""
        title.append(spanInit, spanLast)
    }
}

// @exports
export { renderNestedModules, renderNestedTitle }