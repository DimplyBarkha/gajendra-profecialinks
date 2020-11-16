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
            if (row.productUrl) {
                row.productUrl = [{ text: row.productUrl.map(item => "https://www.utkonos.ru" + item.text).join() }]
            }
            rankCounter += 1;
            row.rank = [{ text: rankCounter }];
            row.rankOrganic = [{ text: rankCounter }];
        }
    }
    context.setState({ rankCounter });
    return data;
};

module.exports = { transform };