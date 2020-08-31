/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

  for (const { group } of data) {
    for (const row of group) {

      try {

        if (row.ratingCount) {
          row.ratingCount = [{ text: row.ratingCount[0].text.split(" ")[2] }];
        }
        if (row.price) {
          row.price = [{ text: row.price[0].text.substring(1) }, { text: row.price[0].text.charAt(0) }];
        }
        if (row.Image360Present) {
          row.Image360Present = [{ text: row.Image360Present[0].text == 'true' ? 'YES' : 'NO' }];
        }
        if (row.colorCode) {
          let colorCodeJson = row.colorCode[0].text.split(";")[0].split(":")[1];
          row.colorCode = [{ text: colorCodeJson }];
        }

      } catch (exception) { console.log('Error in transform', exception); }

    }
  }
  return data;
};

module.exports = { transform };
