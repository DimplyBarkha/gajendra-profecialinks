/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.availabilityText[0].text.includes('innert 1-2')) { row.availabilityText = [{ text: 'In Stock' }]; } else if (row.availabilityText[0].text.includes('sofort lieferbar')) { row.availabilityText = [{ text: 'In Stock' }]; } else if (row.availabilityText[0].text.includes('Morgen geliefert!')) { row.availabilityText = [{ text: 'In Stock' }]; } else if (row.availabilityText[0].text.includes('momentan nicht kaufbar')) { row.availabilityText = [{ text: 'Out of Stock' }]; } else if (row.availabilityText[0].text.includes('Liefertermin nicht bekannt')) {
          if (row.availabilityText[2].text.includes('momentan nicht kaufbar')) {
            row.availabilityText[0] = { text: 'Out of Stock' };
          } else {
            row.availabilityText[0] = { text: 'In Stock' };
          }
          row.availabilityText.pop();
          row.availabilityText.pop();
        }
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
