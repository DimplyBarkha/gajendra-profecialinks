const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'SE',
        store: 'kicks',
        transform: transform,
        domain: 'kicks.se',
        zipcode: '',
    },
    // implementation,
};
// async function implementation(
//     inputs,
//     parameters,
//     context,
//     dependencies,
// ) {
//     const { transform } = parameters;
//     const { productDetails } = dependencies;
//     await context.evaluate(async function () {
//         const randomLink = document.evaluate("//button[@class='bx by bz c0 c1 c6 c7 c8 c9 ca cb cc cd ce cf cg ch ci cj ck g cl cm co cp cn c2 c3 c4 c5']/span", document, null, XPathResult.ANY_TYPE, null);
//         function addclass(xpathforpagination) {
//             var elems = document.querySelectorAll(xpathforpagination);
//             elems[0].classList.add('pagination');
//         }
//         function addHiddenDiv(id, content, index) {
//             const newDiv = document.createElement('div');
//             newDiv.id = id;
//             newDiv.textContent = content;
//             newDiv.style.display = 'none';
//             const originalDiv = document.querySelectorAll('div[class="i j k ce cf cg ch ci cj ck"]>div[class="a bg bh bi bj bk bl"]>div')[index];
//             originalDiv.parentNode.insertBefore(newDiv, originalDiv);
//         }
//         var aggregateRatingXpath = document.querySelectorAll("a[itemscope] > div > span");
//         var countFinal = [];
//         if (aggregateRatingXpath != null) {
//             for (var i = 0; i < aggregateRatingXpath.length; i++) {
//                 let count = 0;
//                 var ratingCount = aggregateRatingXpath[i].childNodes.length;
//                 var ratingName = aggregateRatingXpath[i].childNodes;
//                 for (var j = 0; j < ratingCount; j++) {
//                     // @ts-ignore
//                     var smileClassName = ratingName[0].className;
//                     // @ts-ignore
//                     var RemainingClassName = ratingName[j].className;
//                     if (smileClassName == RemainingClassName) {
//                         count = count + 1
//                     }
//                 }
//                 countFinal.push(count);
//                 var test = countFinal.length;
//             }
//         }
//         for (var j = 0; j < countFinal.length; j++) {
//             addHiddenDiv('rating', countFinal[j], j);
//         }
//     });
//     return await context.extract(productDetails, { transform });
// }