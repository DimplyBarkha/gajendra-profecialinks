const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'GR',
        store: 'hondoscenter',
        transform: transform,
        domain: 'hondoscenter.com',
        zipcode: '',
    },
    implementation,
};
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
        function addElementToDocument(key, value) {
            const catElement = document.createElement('div');
            catElement.id = key;
            catElement.textContent = value;
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
        }

        var getXpath = (xpath, prop) => {
            var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
            let result;
            if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
            else result = elem ? elem.singleNodeValue : '';
            return result && result.trim ? result.trim() : result;
        };

        var upc = getXpath('//td[contains(@class,"Properties")]/table/tbody/tr/td[contains(@class,"UPCs")]/text()', 'nodeValue');
        if (upc != null) {
            upc = upc.split(" ")[0];
            addElementToDocument('upc', upc);
        }
});
return await context.extract(productDetails, { transform });
};

