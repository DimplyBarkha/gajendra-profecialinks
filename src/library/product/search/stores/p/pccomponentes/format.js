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
                    return str.text.replace(/\n/g, ' ');
                });

                row.shippingInfo[0].text = shippingInfo;
            }
            if (row.productUrl) {
                const productUrl = [];
                row.productUrl.forEach((element) => {
                    productUrl.push({
                        text: 'https://www.pccomponentes.com' + element.text,
                        xpath: element.xpath,
                    });
                });
                // row.productUrl = [];
                row.productUrl = productUrl;
            }
            if (row.aggregateRating2) {
                const aggregateRating2 = [];
                row.aggregateRating2.forEach((element) => {
                    aggregateRating2.push({
                        text: element.text.replace('.', ','),
                        xpath: element.xpath,
                    });
                });
                // row.aggregateRating2 = [];
                row.aggregateRating2 = aggregateRating2;
            }
            if (row.thumbnail) {
                const thumbnail = [];
                row.thumbnail.forEach((element) => {
                    thumbnail.push({
                        text: 'https:' + element.text,
                        xpath: element.xpath,
                    });
                });
                // row.thumbnail = [];
                row.thumbnail = thumbnail;
            }
        }
    }
    return data;
};

module.exports = { transform };
