/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/


const transform = (data) => {

    for (const { group } of data) {
        for (const row of group) {
            if (row.price) {
                row.price.toString().replace('.', ",")
            }

            if (row.aggregateRating) {
                row.aggregateRating.forEach(item => {
                    item.text = Number(item.text) ? Number(item.text).toFixed(1) : item.text;
                });
            }

        }

        return data;
    }
}
module.exports = { transform };