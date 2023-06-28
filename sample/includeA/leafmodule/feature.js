/**
 * @leafmodule
 */

/**
 * Leafmodule feature function with private access and inner scope
 * 
 * @function
 * @private
 * @inner
 */
const leafmoduleFeature = () => {}

/**
 * ModuleC feature function with public access and static scope, declared in 
 * leafmodule file with an explicit `@memberof` tag
 * 
 * @function
 * @memberof module:moduleC/feature
 * @public
 * @static
 */
const externalModuleFunction = () => {}