// Copyright (c) 2022 James Reid. All rights reserved.
//
// This source code file is licensed under the terms of the MIT license, a copy
// of which may be found in the LICENSE.md file in the root of this repository.  
// 
// For a template copy of the license see one of the following 3rd party sites:
//      - <https://opensource.org/licenses/MIT>
//      - <https://choosealicense.com/licenses/mit>
//      - <https://spdx.org/licenses/MIT>

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
 * structure. Function directly renders to the passed moduleNavContainer html
 * element. Recursively called for all children within module tree.
 * 
 * @summary Render nested module nav
 * @static
 * @param {HTMLElement} moduleNavContainer - target html element for rendering 
 *      nested module nav
 * @param {NestedModule[]} moduleTree - calculated module tree to re-render in
 *      a nested format
 * @returns {void} 
 */
const renderNestedModules = (moduleNavContainer, moduleTree) => {
    // create root list element for current location/nest level on module tree
    const list = document.createElement("ul")

    // loop over each nested module at the top level of the current
    // location/nest level of the module tree, and render required nav elements
    let scope
    for (const fragment of moduleTree) {
        // if fragment scope has changed since the last fragment, add title
        // reflecting scope of following method(s) - groups methods of same 
        // scope under titles in nav
        if (fragment.scope && scope != fragment.scope) {
            scope = fragment.scope
            const title = document.createElement("li")
            title.classList.add("method-scope-title")
            title.innerHTML = `${fragment.scope} methods`
            list.appendChild(title)
        }

        // create list element for given fragment, and populate attributes from
        // fragment data
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

        // create link element for the given fragment, populate attributes from
        // fragment data, and nest inside list element
        const link = document.createElement("a")
        link.innerHTML = fragment.name
        link.href = fragment.href
        listItem.appendChild(link)
        
        // if there are children, recursively call render function for each
        // child then add result to root list element
        if (fragment.children.length) { 
            renderNestedModules(listItem, fragment.children) 
        }
        list.appendChild(listItem)
    }

    // add result to DOM
    moduleNavContainer.appendChild(list)
}

/**
 * Render nested module title be separating dirname and basename of module into
 * separate spans for styling purposes. Function directly renders to the passed 
 * title html element.
 * 
 * @summary Render nested module title
 * @static
 * @param {HTMLHeadingElement} title 
 * @returns {void}
 */
const renderNestedTitle = title => {
    // only re-render title when part of a nested (non top level) module
    if (absolutePath != "_") {
        // add nested rendering specific class for styles
        title.classList.add("nested-title")

        // fetch and split nested module name from url
        const splitPath = absolutePath.split("_").slice(1)
        const [last, init] = [ 
            /** @type {string} */ (splitPath.pop()), 
            splitPath 
        ]

        // render parent names (dirname) and basename in separate spans
        const spanInit = document.createElement("span")
        spanInit.innerHTML = init.length ? `${init.join(" → ")} → ` : ""
        const spanLast = document.createElement("span")
        spanLast.innerHTML = last

        // reset title and render nested module title
        title.innerHTML = ""
        title.append(spanInit, spanLast)
    }
}

// @exports
export { renderNestedModules, renderNestedTitle }