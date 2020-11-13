const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'leclerc',
    transform: transform,
    domain: 'leclercdrive.fr',
    zipcode: '',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const body = await context.evaluate(function () {
      return document.body.innerHTML;
    });
    try {
      const temp = "Utilitaires.widget.initOptions('ctl00_ctl00_mainMutiUnivers_main_ctl04_pnlElementProduit'";
      const startIndex = body.indexOf(temp);
      let rawtext = body.substring(startIndex + temp.length + 1);
      const endIndex = rawtext.indexOf("}});");
      rawtext = rawtext.substring(0, endIndex + 2);
      console.log(rawtext);
      await context.saveToJson("added-json", rawtext);
    }
    catch (error) {
      console.log(error);
    }
    return await context.extract(productDetails, { transform });
  }
};
