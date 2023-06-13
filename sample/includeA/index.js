/**
 * Submodule path index.js - index file containing multiple functions
 * with different accesses and scopes in order to test the rendering these
 * functions in the correct order in the nav. Testing index file in root of 
 * project - since there is no pathname at the root of the project, module 
 * should resolve to path "index" (reflecting filename) even though index.js 
 * is the default ignored filename
 * 
 * 
 * @submodule
 */

/**
 * Feature function declared in index file with package access and static scope
 * 
 * @function
 * @package
 * @static
 */
const packageStaticFeature = () => {}

/**
 * Feature function declared in index file with public access and static scope
 * 
 * @function
 * @public
 * @static
 */
const publicStaticFeature = () => {}

/**
 * Feature function declared in index file with public access and instance scope
 * 
 * @function
 * @public
 * @instance
 */
const publicInstanceFeature = () => {}

/**
 * Feature function declared in index file with package access and instance 
 * scope
 * 
 * @function
 * @package
 * @instance
 */
const packageInstanceFeature = () => {}

/**
 * Feature function declared in index file with protected access and inner scope
 * 
 * @function
 * @protected
 * @inner
 */
const protectedInnerFeature = () => {}

/**
 * Feature function declared in index file with private access and inner scope
 * 
 * @function
 * @private
 * @inner
 */
const privateInnerFeature = () => {}