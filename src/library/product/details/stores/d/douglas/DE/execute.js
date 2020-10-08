async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;  
  const pageUrl = await context.evaluate(function () {
    return window.location.href;
  });   

  await context.setBlockAds(false); 
  await context.setLoadAllResources(true); 
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true); 
  await context.setAntiFingerprint(false);
  // await context.setUseRelayProxy(false);
  return context.extract(productDetails, { transform });
  
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    domain: 'douglas.de',
  },
  implementation
};
