/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.includes('not available.') ? item.text : 'In Stock.'
        })
      }
      if (row.dimensionsSpecifications) {
        row.dimensionsSpecifications.forEach(item => {
          item.text = item.text.replace(/\n/g, ' ').replace(/\)/g, ') || ')
        })
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          item.text = item.text.replace(/\n\s*\n*/g, ' ')
        })
      }
      if (row.shippingH) {
        row.shippingH.forEach(item => {
          item.text = 'Height: ' + item.text.replace(/-/g, '.') + '" || '
        })
      }
      if (row.shippingD) {
        row.shippingD.forEach(item => {
          item.text = 'Depth: ' + item.text.replace(/-/g, '.') + '" '
        })
      }
      if (row.shippingW) {
        row.shippingW.forEach(item => {
          item.text = 'Width: ' + item.text.replace(/-/g, '.') + '" || '
        })
      }
      if (row.shippingH && row.shippingD && row.shippingW) {
        const dimension = row.shippingW[0].text + row.shippingH[0].text + row.shippingD[0].text
        row.shippingDimensions = [{ text: dimension }]
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/\n \n/g, ' || ')
        })
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n \n \n \n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n \n/g, ' || ').replace(/\n \n \n \n/g, ' : ').replace(/\n \n/g, ' || ').replace(/\n/g, ' ').replace(/\s+/g, ' ')
        })
        row.specifications[0].text = row.dimensionsSpecifications ? row.dimensionsSpecifications[0].text + ' ' + row.specifications[0].text :
          row.specifications[0].text
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/ /g, '')
        })
      }
      row.variantCount = [{ text: 1 }]
    }
  }
  return data;
};

module.exports = { transform };
