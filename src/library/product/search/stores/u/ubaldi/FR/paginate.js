
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    domain: 'ubaldi.fr',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    return false;
  },

};
