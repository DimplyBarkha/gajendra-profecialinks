/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text.includes('Shipping after') ? 'In Stock.' : row.availabilityText[0].text
      }
      if (row.notAvailable) {
        if (row.availabilityText) {
          row.availabilityText[0].text = row.notAvailable[0].text
        } else {
          row.availabilityText = row.notAvailable
        }
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/(.*)\n \nRead More/, '$1 | ').replace(/(.*):\n \n(.*)/g, '$1: || $2').replace(/\n \n/g, '\n').replace(/\n/g, ' || ')
        })
      }
      if (row.features) {
        row.features.forEach(item => {
          item.text = item.text.replace(/(.*)\n \nRead More/, '$1 | ').replace(/(.*):\n \n(.*)/g, '$1: || $2').replace(/\n \n/g, '\n').replace(/\n/g, ' || ')
        })
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = row.features ? (row.features[0].text + item.text).trim() : item.text.trim()
        })
      } else if (row.features) {
        row.description = row.features
      }
      if (row.productDimensions) {
        if (row.productDimensions[0].text.includes('Package') || row.productDimensions[0].text.includes('Shipping')) {
          row.productDimensions.forEach(item => {
            item.text = item.text.replace(/([a-zA-z]+)(\d+.?\d*)\"/g, '$1: $2" | ').replace(/(.*) \|/, '$1').trim()
          })
          row.shippingDimensions = row.productDimensions
        }
      }
      row.variantCount = [{ text: 1 }]
      if (row.specifications) {
        let specText = row.specifications.reduce((specText = '', item) => {
          specText += item.text.includes('Dimensions') ? item.text.replace(/([a-zA-z]+)(\d+.?\d*)\"/g, '$1: $2" || ').replace(/(.*) \|/, '$1').trim() + ' || ' : item.text.replace(/\n/g, ' || ') + ' || '
          return specText
        }, '')

        row.specifications = [{ text: specText.replace(/( \|\| )$/, '') }]
      }
      if (row.weightNetDesck) {
        row.weightNet = row.weightNetDesck
      }
      if (row.productOtherInformation) {
        row.productOtherInformation.forEach(item => {
          item.text = item.text.replace(/\n \n/g, '\n').replace(/\n/g, ' || ').trim()
        })
      }
    }
  }
  return data;
};

module.exports = { transform };
