const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'SE',
        store: 'kicks',
        transform: transform,
        domain: 'kicks.se',
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
        //for rank
        function addHiddenDiv(id, content, index) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            const originalDiv = document.querySelectorAll("span[class='eo du']")[index];
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
        }
        let firstChildNode;
        const aggregateRating = document.querySelectorAll("span[class='eo du']")
        for (let k = 0; k < aggregateRating.length; k++) {
            firstChildNode = aggregateRating[k].getElementsByClassName('ep eq').length
            addHiddenDiv('aggregateRating', firstChildNode, k);
        }
        while (!!document.querySelector('#container > div > div > div.a.h > main > div > div.b7.b8.b9.ba > div > div.i.j.k.a.b > div.i.j.k.ce.fz.cf.g0.cg.g1.ch.g2.ci.g3.cj.g4.a.b.q.g5 > button > span > font > font')) {
            // @ts-ignore
            document.querySelector('#container > div > div > div.a.h > main > div > div.b7.b8.b9.ba > div > div.i.j.k.a.b > div.i.j.k.ce.fz.cf.g0.cg.g1.ch.g2.ci.g3.cj.g4.a.b.q.g5 > button > span > font > font').click()
            await new Promise(r => setTimeout(r, 6000));
        }
    });
    return await context.extract(productDetails, { transform });
}