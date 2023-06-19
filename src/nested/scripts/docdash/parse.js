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
 * @file Method for parsing modules from the docdash DOM into a nested module
 *      tree object for later re-render.
 * @module docdash/parse
 * @author James Reid
 */

// @ts-check

// @imports-types
import { NestedModule } from "../../types/index.js"
// @imports-local
import {
    methodRegex,
    childPathRegex,
    siblingPathRegex,
    methodSignatureRegex,
    absolutePath
} from "../shared/index.js"

// @body
/**
 * 
 * @summary Parses existing nav into a nested structure for re-render
 * @param {HTMLUListElement} navList - Original modules nav list
 * @returns {NestedModule[]}
 */
const parseModules = navList => {
    const moduleTree = []
    for (const childNode of navList.querySelectorAll(":scope > li")) {
        if (!childNode.firstChild) { continue } // for when multiple files have same module name and extra lists are spawned
        
        const link = /** @type {HTMLLinkElement} */ 
            (childNode.querySelector(":scope > a"))
        const methods = /** @type {NodeListOf<HTMLLinkElement>} */
            (childNode.querySelectorAll(":scope > ul > li > a"))
        const splitPath = link.innerHTML.split("/")
        const [last, init] = [ 
            /** @type {string} */ (splitPath.pop()), 
            splitPath 
        ]

        let scope = moduleTree
        let scopePath = ""
        for (const name of init) {
            let inner = scope.find(obj => obj.name === name)
            if (!inner) {
                inner = getFragment({ name, link, scopePath })
                scope.push(inner)
            }
            scope = inner.children
            scopePath = inner.path
        }

        const inner = scope.find(obj => obj.name === last)
        if (inner) {
            Object.assign(inner, { type: "module", href: link.href })
            for (const link of methods) {
                inner.children.push(getFragment({ 
                    name: link.innerHTML, 
                    link, 
                    scopePath: inner.path
                }))
            }
            inner.children.sort((optA, optB) => getPriority(optA, optB))
        }
        else {
            const children = []
            for (const link of methods) {
                children.push(getFragment({ 
                    name: link.innerHTML, 
                    link, 
                    scopePath: `${scopePath}_${last}`
                }))
            }
            children.sort((optA, optB) => getPriority(optA, optB))
            scope.push(getFragment({ name: last, link, scopePath, children }))
        }        
    }

    return moduleTree
}

/**
 * 
 * @param {NestedModule} optA 
 * @param {NestedModule} optB 
 * @returns {number}
 */
const getPriority = (optA, optB) => {
    return (getTypePriority(optA, optB)) << 3
        + (getSignaturePriority(optA, optB, "scope") << 2) 
        + (getSignaturePriority(optA, optB, "access") << 1) 
        + getAlphaPriority(optA, optB)
}

/**
 * 
 * @param {NestedModule} optA 
 * @param {NestedModule} optB 
 * @returns {number}
 */
const getTypePriority = (optA, optB) => {
    return optA.type === "method" && optB.type != "method" ? - 1
        : optA.type != "method" && optB.type === "method" ? 1
        : 0
}

/**
 * 
 * @param {NestedModule} optA 
 * @param {NestedModule} optB 
 * @param {"access"|"scope"} key 
 * @returns {number}
 */
const getSignaturePriority = (optA, optB, key) => {
    const order = key === "access"
        ? ["public", "package", "protected", "private"]
        : ["global", "instance", "static", "inner"]
    return (order.indexOf(optA[key] || "") - order.indexOf(optB[key] || "")) % 2
}

/**
 * This is a description
 * 
 * @param {NestedModule} optA 
 * @param {NestedModule} optB 
 * @returns {number}
 */
const getAlphaPriority = (optA, optB) => {
    return optA.name.localeCompare(optB.name) % 2
}

/**
 * This is the function description
 * @summary Get fragment of nested module nav structure
 * @param {object} argObj 
 * @param {string} argObj.name
 * @param {HTMLLinkElement} argObj.link
 * @param {string} argObj.scopePath
 * @param {NestedModule[]} [argObj.children=[]]
 * @returns {NestedModule}
 */
const getFragment = ({ name, link, scopePath, children = [] }) => {
    // fetch href from the html link element and calculate full path of fragment
    const { href } = link
    const path = `${scopePath}_${name}`

    const type = methodRegex.test(href) ? "method"
        : children.length ? "module" 
        : "namespace-module"

    const hierarchy = absolutePath === path ? "selected"
        : absolutePath.includes(path) ? "parent"
        : childPathRegex.test(path) ? "child"
        : type != "method" && siblingPathRegex.test(path) ? "sibling"
        : "hidden"

    if (type === "method" && hierarchy === "child") {
        const [id] = /** @type {string[]} */ (href.match(/(?<=\.html#).*$/))
        const method = /** @type {HTMLElement} */ (document.getElementById(id))
        
        let { access, scope } = /** @type {Object.<string, string>} */ (method
            .querySelector(":scope > span")
            ?.innerHTML
            .match(methodSignatureRegex)
            ?.groups)
        access ??= "public"
        scope ??= "instance"
        return { name, href, type, hierarchy, path, children, access, scope }
    }
    else {
        return { name, href, type, hierarchy, path, children }
    }
}

// @exports
export { parseModules }