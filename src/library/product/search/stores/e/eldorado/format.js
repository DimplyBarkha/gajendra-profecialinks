/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const state = context.getState();
    let rankCounter = state.rankCounter || 0;
    for (const { group } of data) {
        for (const row of group) {
            rankCounter = rankCounter + 1;
            row.rankOrganic = [{ text: rankCounter }];
            row.rank = [{ text: rankCounter }];
            context.setState({ rankCounter });
            if (row.shippingInfo) {
                const shippingInfo = row.shippingInfo.map((str) => {
                    return str.text.replace(/\n/g, " ");
                });

                row.shippingInfo[0].text = shippingInfo;
            }
            if (row.productUrl) {
                const productUrl = [];
                row.productUrl.forEach((element) => {
                    productUrl.push({
                        text: "https://www.eldorado.ru" + element.text,
                        xpath: element.xpath,
                    });
                });
                // row.productUrl = [];
                row.productUrl = productUrl;
            }
        }
    }
    return data;
};

module.exports = { transform };
