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
 * @file Methods for mounting elements in page which need to be re-rendered
 * @module docdash/mount
 * @author James Reid
 */

// @ts-check

// @body
/**
 * Locates the nav list element for documented modules (rendered under a 
 * "modules" heading element), and optionally replaces it with a div container
 * for rendering nested modules to. Returns both original nav list and new div.
 * 
 * @summary Mounts module nav list and optionally replaces it with div container
 * @param {boolean} unmountExisting - Flag indicating if the existing module
 *      nav element should be replaced with the new nested module nav element
 * @returns {{navList: HTMLUListElement, moduleNavContainer: HTMLDivElement}}
 */
const mountNav = (unmountExisting = true) => {
    const nav = document.getElementsByTagName("nav")[0] // fetch nav element
    const moduleNavContainer = document.createElement("div") // nested container

    // loop over nav element looking for module subsection
    for (const child of nav.children) {
        // in module subsection return the located nav list and optionally 
        // replace it in DOM with the container for rendering nested modules
        if (child.tagName === "H3" && child.innerHTML === "Modules") {
            const navList = /** @type {HTMLUListElement} */ (child.nextSibling)
            if (unmountExisting) { navList.replaceWith(moduleNavContainer) }
            return { navList, moduleNavContainer }
        }
    }

    // throw error in the event that no modules are documented, which will
    // cause no module section to be generated in the nav
    throw new Error("Module nav list not found")
}

/**
 * Locates and returns page H1 title in main div of page
 * 
 * @summary Mounts page title
 * @returns {HTMLHeadingElement}
 */
const mountTitle = () => {
    return (/** @type {HTMLHeadingElement} */ 
        (document.querySelector("div#main h1.page-title")))
}

export { mountNav, mountTitle }