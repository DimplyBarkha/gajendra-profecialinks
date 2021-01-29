const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'MedikamentePerKlick',
    transform: transform,
    domain: 'medikamente-per-klick.de',
  },
};