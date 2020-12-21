const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'DE',
        store: 'flaconi',
        transform: transform,
        domain: 'flaconi.de',
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
    await context.evaluate(async function() {

        let nextLink = document.querySelector('a[class*="next"]');
        if (nextLink) {
            let b = document.createElement('link');
            b.setAttribute("rel", "next");
            b.setAttribute("href", nextLink.href);
            document.head.append(b);
        }

        function addHiddenDiv(id, content, index) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            const originalDiv = document.querySelectorAll('div.product-item-box ')[index];
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
        }

        function addElementToDocument(key, value) {
            const catElement = document.createElement('div');
            catElement.id = key;
            catElement.textContent = value;
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
        }
        const getAllXpath = (xpath, prop) => {
            const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const result = [];
            for (let index = 0; index < nodeSet.snapshotLength; index++) {
                const element = nodeSet.snapshotItem(index);
                if (element) result.push(prop ? element[prop] : element.nodeValue);
            }
            return result;
        };
        var aggregateRating = getAllXpath("//span[@class='sr-only']//text()", 'nodeValue')
        var length = aggregateRating.length
        for (let i = 0; i < length; i++) {
            var b = aggregateRating[i].split(" ");
            addHiddenDiv('rating1', b[0], i);
        }
        try {
            document.getElementById('pd_url').remove();
        } catch (error) {}
        addElementToDocument('pd_url', URL);
    });
    return await context.extract(productDetails, { transform });
}