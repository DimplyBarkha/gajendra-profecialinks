/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    var rank = 1
    for (const { group } of data) {
        for (const row of group) {
            if (row.productUrl) {
                row.productUrl.forEach(item => {
                    if(item.text.indexOf("https") < 0){
                        item.text = "https:" + item.text;
                    }
                });
            }
            if (row.thumbnail) {
                row.thumbnail.forEach(item => {
                    if(item.text.indexOf("https") < 0){
                        item.text = "https:" + item.text;
                    }
                });
            }
            row.rankOrganic = row.rank = [{ 'text': rank }];
            rank = rank + 1;
        }
    }
    return data;
};

module.exports = { transform };