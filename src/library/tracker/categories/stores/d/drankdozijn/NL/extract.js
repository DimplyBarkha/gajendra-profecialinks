async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  let dataRef = await context.extract(productMenu);
  const array = [];
  for (let i = 0; i < dataRef.length; i++) {
    array.push(...dataRef[i].group);
  }
  dataRef[0].group = array;
  dataRef = dataRef.splice(1, dataRef.length - 1);
  return dataRef;
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NL',
    domain: 'drankdozijn.nl',
    store: 'drankdozijn',
    zipcode: '',
  },
  implementation,
};
