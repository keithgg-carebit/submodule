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
 * @file Defines regexps required for parsing the existing nav into a module
 *      tree
 * @module shared/regex
 * @author James Reid
 */

// @ts-check

// @body
/**
 * Captures module name from href
 *
 * @static
 * @type {RegExp}
 */
const moduleRegex = /(?<=\/module-).*(?=\.html)/;

/**
 * Creates absolute path for a given module name, separating with underscores
 * rather than slashes, and including a leading character
 *
 * @static
 * @type {string}
 */
const windowLocation = window.location.href.endsWith(".html")
  ? window.location.href
  : window.location.href + ".html";

const absolutePath = `_${windowLocation.match(moduleRegex)?.[0] || ""}`;

/**
 * Captures module name, but only matches if the link if it includes an id at
 * the end (note trailing #)
 *
 * @static
 * @type {RegExp}
 */
const methodRegex = /(?<=\/module-).*(?=\.html#)/;

/**
 * Captures a root path module (i.e. a path with no nesting: _root vs _not_root)
 *
 * @static
 * @type {RegExp}
 */
const rootPathRegex = /^_[^_]*$/;

/**
 * Captures direct child path from calculated absolute path (i.e. paths which
 * are direct children of absolute path: _absolute_path_child vs
 * _absolute_path_not_child)
 *
 * @static
 * @type {RegExp}
 */
const childPathRegex = new RegExp(`^${absolutePath}${/_[^_]*$/.source}`);

/**
 * Captures sibling paths from calculated absolute path (i.e. paths which are
 * at the same nested level as the absolute path: _absolute_path is sibling to
 * _absolute_sibling, but not to _absolute nor _absolute_path_child). This regex
 * is calculated programmatically, and is therefore not declared in a const
 * assignment, but is marked as readonly as it should not be changed elsewhere.
 *
 * @static
 * @readonly
 * @type {RegExp}
 */
let siblingPathRegex = /(^_[^_]*$)/;
let siblingScopePath = "";
for (const scope of absolutePath.split("_").slice(1)) {
  siblingScopePath = `${siblingScopePath}_${scope}`;
  const regex = new RegExp(`(^${siblingScopePath}${/_[^_]*$/.source})`);
  siblingPathRegex = new RegExp(`${siblingPathRegex.source}|${regex.source}`);
}

// named capture groups for access and scope - required by methodSignatureRegex
const accessRegex = /(?<access>(public|package|protected|private))/;
const scopeRegex = /(?<scope>(global|instance|static|inner))/;

/**
 * Captures a method signature regardless of if only access or only scope, both,
 * or no signature is rendered
 *
 * @static
 * @type {RegExp}
 */
const methodSignatureRegex = new RegExp(
  `(\\()?${accessRegex.source}?(,\\s)?${scopeRegex.source}?(\\))?`,
  "i"
);

// @exports
export {
  moduleRegex,
  methodRegex,
  rootPathRegex,
  childPathRegex,
  siblingPathRegex,
  methodSignatureRegex,
  absolutePath,
};
