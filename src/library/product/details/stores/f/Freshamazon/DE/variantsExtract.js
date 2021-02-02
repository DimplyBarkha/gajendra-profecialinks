// const { implementation } = require('../../../../sharedAmazon/variantExtract');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'Freshamazon',
    transform: null,
    domain: 'amazon.de',
    zipcode: '10243',
  },
  dependencies: {
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
    variants: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/variantsExtract',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { Helpers: { Helpers }, AmazonHelp: { AmazonHelp }, variants } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  const thisUPC = await context.evaluate(() => {
    const url = window.location.href;
    console.log('URL', url);
    let splits = url && url.split('dp/product/')[1] ? url.split('dp/product/')[1].split('/?') : [];
    if (splits.length < 1) {
      splits = url && url.split('dp/')[1] ? url.split('dp/')[1].split('/') : [];
    }
    return splits[0];
  });

  const allVariants = await amazonHelp.getVariants();
  if (thisUPC && !allVariants.includes(thisUPC.slice(0, 10))) {
    allVariants.push(thisUPC.slice(0, 10));
  }

  await context.evaluate((allVariants) => {
    const url = 'https://www.amazon.de/dp/{id}/ref=sr_1_1?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&fpw=fresh&keywords={id}&s=amazonfresh&sr=1-1';

    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    allVariants.forEach(variant => {
      let finalURl = url;
      finalURl = finalURl.replace(/{id}/g, variant);
      addHiddenDiv('ii_variant', variant);
      addHiddenDiv('ii_variantURL', finalURl);
    });
  }, allVariants);

  return await context.extract(variants);
};

