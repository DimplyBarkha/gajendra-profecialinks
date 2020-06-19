
// module.exports = {
//   implements: 'product/details/execute',
//   parameterValues: {
//     country: 'US',
//     store: 'amazonPrimeNow_75204',
//     domain: 'primenow.amazon.com',
//   },
// };

const { implementation } = require('../../../../execute');

async function localImplementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const primeZipCode = parameters.store.match(/\d{5}/g)[0];

  context.primeZipCode = () => primeZipCode;

  return await implementation(inputs, parameters, context, dependencies);
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow_75204',
    domain: 'primenow.amazon.com',
  },
  implementation: localImplementation,
};
