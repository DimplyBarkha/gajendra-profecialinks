/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
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
      if (!row.shippingInfo) {
        if (row.deliveryInfo && row.deliveryInfo[0].text.includes('Ship')) {
          row.shippingInfo = row.deliveryInfo
        }
      }
      if (row.specifications) {
        let specText = row.specifications.reduce((specText = '', item) => {
          specText += item.text.includes('Dimensions') ? item.text.replace(/([a-zA-z]+)(\d+.?\d*)\"/g, '$1: $2" || ').replace(/(.*) \|/, '$1').trim() + ' || ' : item.text.replace(/\n/g, ' || ') + ' || '
          return specText
        }, '')

        row.specifications = [{ text: specText.replace(/( \|\| )$/, '') }]
      }
      if (!row.weightNet) {
        if (row.weightNetDesck) {
          row.weightNet = row.weightNetDesck
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
