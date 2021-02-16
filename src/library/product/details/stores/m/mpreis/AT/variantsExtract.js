
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    transform: null,
    domain: 'shop.mpreis.at',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { createUrl, variants } = dependencies;
    await context.waitForSelector('#uc-btn-accept-banner');
    await context.click('#uc-btn-accept-banner');
    await context.evaluate(function () {
      const variantsLinks = document.querySelectorAll('.panel-title a');
      const variantsArr = [];
      variantsLinks.forEach(variantsLink => {
          const variantText = variantsLink.textContent.trim();
          if(!variantsArr.includes(`${variantText}`)){
            const href = variantsLink.getAttribute('href');
            variantsLink.className += ` mp-variant-link mp-variant-link-${variantText.replace(/ /, '-')}`; 
            variantsLink.setAttribute('data-href', `${window.location.href}${href}`);

            const linkNode = document.createElement('span');
            linkNode.style.display = 'none';
            linkNode.textContent = `${window.location.href}${href}`;
            variantsLink.append(linkNode);
            
            const variantNode = document.createElement('i');
            variantNode.style.display = 'none';
            variantNode.textContent = variantText;
            variantsLink.append(variantNode);

            variantsArr.push(variantText);
          }
      });
      console.log(variantsArr);

    }, createUrl);
  return await context.extract(variants);
  },
};
