/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.productUrl) {
                let url = "https://www.extra.com"; 
                row.productUrl.forEach(item => {
                    item.text = url.concat(item.text);
                });
            }

            if (row.thumbnail) {
                let url = "https:"; 
                row.thumbnail.forEach(item => {
                    if (!item.text.includes("https")) {
                        item.text = url.concat(item.text);
                    }
                });
            }
        }
    }
    return data;
};

module.exports = { transform };