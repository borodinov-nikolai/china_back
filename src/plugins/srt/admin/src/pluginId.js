import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '');
pluginId.at(0).toLocaleUpperCase()
export default pluginId;
