const { transform } = require('../../../../shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop <= 20000) {
            await stall(500);
            scrollTop += 500;
            window.scroll(0, scrollTop);
            if (scrollTop === 20000) {
                await stall(8000);
                break;
            }
        }
        function stall(ms) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, ms);
            });
        }
        function addHiddenDiv1(id, content, index) {
            // @ts-ignore
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            const originalDiv = document.querySelectorAll('div[class="wishlist"]')[index];
            // @ts-ignore
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
          };
    
          const getAllXpath = (xpath, prop) => {
            const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const result = [];
            for (let index = 0; index < nodeSet.snapshotLength; index++) {
            const element = nodeSet.snapshotItem(index);
            if (element) result.push(prop ? element[prop] : element.nodeValue);
            }
            return result;
            };
            var p = getAllXpath('//div[@class="wishlist"]/a/@onclick', 'nodeValue');
            for(var i=0; i<p.length; i++){
                var ab = p[i].split("'add',")[1].split(",")[1];
                ab = ab.slice(1,-1);
                addHiddenDiv1('id', ab, i);
            }
    });
    return await context.extract(productDetails, { transform });
}
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'ES',
        store: 'primor',
        transform: transform,
        domain: 'primor.eu',
    },
    implementation,
};