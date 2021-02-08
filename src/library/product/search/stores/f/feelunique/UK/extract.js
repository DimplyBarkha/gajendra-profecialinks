const { transform } = require('../../../../shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
	) {
	 const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
        while (!!document.querySelector('a.loadMoreButton')) {
            // @ts-ignore
            document.querySelector('a.loadMoreButton').click()
            await new Promise(r => setTimeout(r, 8000));
        }
        function addHiddenDiv(id, content, index) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            const originalDiv = document.querySelectorAll('div[class="Product-image-wrapper"]')[index];
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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

        try {

            const data = getAllXpath('//div[@class="Product-image-wrapper"]/img/@data-src', 'nodeValue')
          for (let k = 0; k < data.length; k++) {

            var first = data[k].split("products/")[1].split("/")[0]
            var check = data[k].split("products/")[1].split("/")[1]
            if (check == "sub-") {
                var second = data[k].split("products/")[2].split("_")[0]
            }
            var result = ""
            if (first & second) {
                result = first + '-' + second
            }
            else {
                result = first
            }
            addHiddenDiv("searchID", result,k)
        }
        } catch (error) {

        }
    })


    return await context.extract(productDetails, { transform });
}
module.exports = {
implements: 'product/search/extract',
    parameterValues: {
        country: 'UK',
        store: 'feelunique',
        transform: transform,
        domain: 'feelunique.com',
    },
    implementation,
}; 