const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    transform,
    domain: 'citilink.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.clickAndWaitForNavigation(".for_attachments_view")
      .then(async () => {
        await context.clickAndWaitForNavigation(".for_specification_view")
          .catch(() => { });
      })
      .catch(() => { });
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        const pdfDocument = document.evaluate('//div[contains(@class, "documents")]//a/@href', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE).singleNodeValue;
        addHiddenDiv('import_availability_text', window.dataLayer[0].productAvailability);
        addHiddenDiv('import_list_price', "RUB" + parseInt(window.dataLayer[0].productOldPrice));
        pdfDocument && addHiddenDiv('import_document_pdf', pdfDocument.nodeValue && "Yes");
      } catch (error) {
        console.log('Error: ', error);
      }
    })
    return await context.extract(data, { transform });
  }
};
