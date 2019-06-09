import httperror from 'http-errors';
import _ from "lodash";

/**
 * Normalize a Yaml setting, allowing to pass a single word or a list of words separated by spaces.
 * Heavily inspired by the normalizeUserList function from Verdaccio.
 * @return {Array}
 */
export function normalizeYamlSetting(setting: any) {
  const result = [];
  /* eslint prefer-rest-params: "off" */

  // if it's a string, split it to array
  if (_.isString(setting)) {
    result.push(setting.split(/\s+/));
  } else if (Array.isArray(setting)) {
    result.push(setting);
  } else {
    throw httperror('CONFIG: bad package acl (array or string expected): ' + JSON.stringify(setting));
  }

  return _.flatten(result);
}
