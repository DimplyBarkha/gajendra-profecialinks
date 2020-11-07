module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'metro',
    transform: null,
    domain: 'metro.de',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const productDesc = 'div h3';
    // Wait for selector so that data can be extracted.
    await context.waitForSelector(productDesc, { timeout: 20000 });
    await context.evaluate(async () => {
      function addTempDiv (id, data) {
        const tempDiv = document.createElement('div');
        tempDiv.id = id;
        tempDiv.textContent = data;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
      }
      // Availability
      const xpath = '(//div[contains(@class,\'mfcss_availability\')])[last()]';
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (element) {
        const availStr = element.textContent;
        let availOut = 'Out of Stock';
        if (availStr.includes('Verfügbar') || availStr.includes('verfügbar')) {
          availOut = 'In Stock';
        }
        addTempDiv('mod_avail', availOut);
      }
      // pdf download
      let pdfAvail = 'No';
      if (document.querySelector('i[class="icon-download icon-lg"]')) {
        pdfAvail = 'Yes';
      }
      addTempDiv('mod_pdf', pdfAvail);
    });
    return await context.extract(productDetails, { transform });
  },
};
