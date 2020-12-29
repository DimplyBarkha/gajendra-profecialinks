
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    transform: null,
    domain: 'lomax.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
    function addElementToDocument(key, value) {
    const catElement = document.createElement('div');
    catElement.id = key;
    catElement.textContent = value;
    catElement.style.display = 'none';
    document.body.appendChild(catElement);
    }
    const getXpath = (xpath, prop) => {
    const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    let result;
    if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    else result = elem ? elem.singleNodeValue : '';
    return result && result.trim ? result.trim() : result;
    };
    const aggr = getXpath("//div[@class='container productcard']/@data-gtm-rating", 'nodeValue');
    try {
    if (aggr != null) {
    let str = aggr
    var a=str.replace('.',',')
    addElementToDocument('aggr', a)
    }
    }
    catch (error) {
    }
    });
    await context.extract(productDetails, { transform: transformParam });
    },
    };
