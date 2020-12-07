// this file is kept for backward compatibility puproses
// when possible and redeploying a search extractor, migrate to the new pagination by:
// in the file paginate.js
// replace the line: implements: 'product/search/paginate',
// by the line:  implements: 'navigation/paginate',

module.exports = require('../../../navigation/paginate/action');
