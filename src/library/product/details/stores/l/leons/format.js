/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.features) {
        row.features.forEach(item => {
          item.text = item.text.replace(/(.*)\n \nRead More/, '$1 | ').replace(/(.*):\n \n(.*)/, '$1: || $2').replace(/\n/g, ' || ')
        })
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = row.features ? (row.features[0].text + item.text).trim() : item.text.trim()
        })
      } else if (row.features) {
        row.description = row.features
      }
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          item.text = item.text.replace(/([a-zA-z]+)(\d+.?\d*)\"/g, '$1: $2" | ').replace(/(.*) \|/, '$1').trim()
        })
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
        row.weightNet = row.weightGross ? row.weightGross : []
        row.shippingWeight = row.weightGross ? row.weightGross : []
      }
      if (row.weightGross) {
        row.weightGross = row.weightNet ? row.weightNet : []
        row.shippingWeight = row.weightNet ? row.weightNet : []
      }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     item.text = (+item.text).toFixed(1)
      //   })
      // }
      // if (row.technicalInformationPdfPresent) {
      //   row.technicalInformationPdfPresent[0].text = 'Yes'
      // }

      // if (row.termsAndConditions) {
      //   row.termsAndConditions[0].text = 'Yes'
      // }

      // if (row.manufacturerDescription) {
      //   row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\{.*\}/, '').trim()
      // }

      // if (row.image) {
      //   row.image.forEach(item => {
      //     item.text = item.text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500')
      //   })
      // }

      // if (row.alternateImages) {
      //   row.alternateImages.forEach(item => {
      //     item.text = item.text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500')
      //   })
      // }

      // if (row.imageAlt) {
      //   row.imageAlt.forEach(item => {
      //     item.text = item.text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500')
      //   })
      // }

      // if (row.specifications) {
      //   row.specifications[0].text = ''
      //   if (row.dimensionsSpecifications) {
      //     row.dimensionsSpecifications.forEach(item => {
      //       item.text = 'Dimensions ' + item.text.replace(/\)\n/g, ') : ').replace(/\n/g, ' || ').trim();
      //     });
      //     row.specifications[0].text += row.dimensionsSpecifications[0].text
      //   }
      //   if (row.detailsSpecifications) {
      //     row.detailsSpecifications.forEach(item => {
      //       item.text = ' || Details ' + item.text.replace(/\n(.*)\n/g, ' : $1 || ').replace(/\n/, ' : ').trim();
      //     });
      //     row.specifications[0].text += row.detailsSpecifications[0].text
      //   }
      //   if (row.warrantySpecifications) {
      //     row.warrantySpecifications.forEach(item => {
      //       item.text = ' || Warranty / Certifications ' + item.text.replace(/\n/g, '').trim();
      //     });
      //     row.specifications[0].text += row.warrantySpecifications[0].text
      //   }
      // }

      // if (row.manufacturerDescription) {
      //   row.manufacturerDescription.forEach(item => {
      //     item.text = item.text.replace(/(\s?\n\s?)+/g, ' ').replace('Product Overview', '').trim();
      //   });
      // }

      // if (row.shippingDimensions) {
      //   row.shippingDimensions.forEach(item => {
      //     item.text = item.text.replace(/\)\n/g, ') : ').replace(/\n/g, ' | ').trim();
      //   });
      // }

      // if (row.descriptionBullets) {
      //   row.descriptionBullets.forEach(item => {
      //     if (item.text === '0') {
      //       item.text = '';
      //     }
      //   });
      // }

      // if (row.description) {
      //   row.description.forEach(item => {
      //     item.text = item.text.replace(/Overview/g, '').replace(/# ?/g, '').trim();
      //   });
      //   if (row.descriptionBulletsInfo) {
      //     row.descriptionBulletsInfo.forEach(item => {
      //       item.text = item.text.replace(/(\s?\n)+/g, ' || ').replace(/# ?/g, '').trim();
      //     });
      //   }
      //   row.description[0].text = row.description[0].text + ' || ' + row.descriptionBulletsInfo[0].text
      // }

      // if (row.nameExtended) {
      //   row.nameExtended.forEach(item => {
      //     item.text = item.text.replace(/-\s*The Home Depot$/, '').replace(/#/g, '').replace(/Model  /, ' Model ').replace(/SKU  /, 'SKU ').trim();
      //   });
      // }
      // if (row.warnings) {
      //   row.warnings.forEach(item => {
      //     item.text = item.text.replace(/see\s*/i, '').trim();
      //   });
      // }
      // if (row.mpc) {
      //   row.mpc.forEach(item => {
      //     item.text = item.text.replace(/.*?#/, '').trim();
      //   });
      // }
    }
  }
  return data;
};

module.exports = { transform };
