async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const { url, id } = inputs;
  console.log("parameters:: ", parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//article//a');
    await context.waitForSelector('article> a');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('article> a');
      firstItem.click();
    });
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'rappi',
    transform: null,
    domain: 'rappi.com.co',
    zipcode: '',
  },
  implementation,
};
