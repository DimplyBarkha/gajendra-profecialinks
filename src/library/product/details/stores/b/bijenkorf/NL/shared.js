
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.brandText) {
        let nameExtended = `${row.brandText[0].text}`;
        if (row.nameSuffix) {
          nameExtended = `${nameExtended} ${row.nameSuffix[0].text}`;
        }
        let imNameExtended = nameExtended;
        if (row.name) {
          // This is only true for im
          imNameExtended = `${imNameExtended} ${row.name[0].text}`.trim();
        }
        if (row.variantInformationFromMatt) {
          nameExtended = `${nameExtended}  ${row.variantInformationFromMatt[0].text}`;
          imNameExtended = `${imNameExtended}  ${row.variantInformationFromMatt[0].text}`;
        } else if (row.variantInformation) {
          nameExtended = `${nameExtended}  ${row.variantInformation[0].text}`;
          imNameExtended = `${imNameExtended}  ${row.variantInformation[0].text}`;
        } else if (row.singleProductVariantInformation) {
          nameExtended = `${nameExtended}  ${row.singleProductVariantInformation[0].text}`;
          imNameExtended = `${imNameExtended}  ${row.singleProductVariantInformation[0].text}`;
        }
        row.nameExtended = [{ text: nameExtended }];
        row.imNameExtended = [{ text: imNameExtended }];
      }

      if (row.directions) {
        let directionsText = row.directions[0].text;
        directionsText = directionsText.substr(directionsText.indexOf('Gebruikstips:'), directionsText.length);
        row.directions[0].text = directionsText.replace('Gebruikstips:', '').trim();
        if (row.directions[0].text.trim().length === 0) {
          delete row.directions;
        }
      }

      if (!row.directions && row.directionsFromFollowingP) {
        row.directions = row.directionsFromFollowingP;
        row.directions[0].text = row.directions[0].text.trim();
      }

      if (!row.directions && row.directionsFromStrong) {
        let directionsText = row.directionsFromStrong[0].text;
        directionsText = directionsText.substr(directionsText.indexOf('Gebruikstips:'), directionsText.length);
        directionsText = directionsText.replace('Gebruikstips:', '');
        row.directions = [{ text: directionsText }];
      }

      if (row.directions) {
        let directionsStr = '';
        if (row.directions.length > 1) {
          for (let i = 0; i < row.directions.length; i++) {
            directionsStr += ` ${row.directions[i].text}`;
          }
          row.directions = [{ text: directionsStr }];
        }
      }

      if (row.specifications) {
        let specString = '';
        for (let i = 0; i < row.specifications.length; i++) {
          specString += ` || ${row.specifications[i].text}`;
        }
        row.specifications = [{ text: specString }];
      }

      if (!row.image && row.singleProductimage) {
        row.image = row.singleProductimage;
      }

      if (row.variantInformationFromMatt) {
        row.variantInformation = row.variantInformationFromMatt;
      }

      if (!row.variantInformation && row.singleProductVariantInformation) {
        row.variantInformation = row.singleProductVariantInformation;
      }

      if (!row.alternateImages && row.singleProductAlternateImages) {
        row.alternateImages = row.singleProductAlternateImages;
      }

      if (!row.sku && row.singleProductsku) {
        row.sku = row.singleProductsku;
      }

      if (row.sku) {
        row.variantId = row.sku;
      }

      if (!row.secondaryImageTotal && row.singleProductSecondaryImageTotal) {
        row.secondaryImageTotal = row.singleProductSecondaryImageTotal;
      }

      if (!row.imageAlt && row.singleProductImageAlt) {
        row.imageAlt = row.singleProductImageAlt;
      }

      if (!row.price && row.singleProductPriceText) {
        row.price = row.singleProductPriceText;
      }

      if (!row.variantCount && row.variantCountFromDropdown) {
        row.variantCount = row.variantCountFromDropdown;
      }

      if (!row.listPrice && row.singleProductListPrice) {
        if (row.variantCount && row.variantCount[0].text == 0) {
          row.listPrice = row.singleProductListPrice;
        }
      }

      if (!row.promotion && row.singleProductPromotionText) {
        if (row.variantCount && row.variantCount[0].text == 0) {
          row.promotion = row.singleProductPromotionText;
        }
      }

      if (row.availabilityText && row.availabilityText[0].text === 'Out of stock' && row.singleProdAvailabilityText) {
        row.availabilityText = row.singleProdAvailabilityText;
      }

      if (!row.quantity && row.variantInformationFromMatt) {
        row.quantity = row.variantInformationFromMatt;
      }

      if (row.quantity && row.quantity[0].text.indexOf('(online') > -1) {
        row.quantity = [{ text: row.quantity[0].text.slice(0, row.quantity[0].text.indexOf('(online')).trim() }];
      }

      if (row.unInterruptedPDP) {
        const pdp = Array.from(new Set(row.unInterruptedPDP.map(elm => elm.text.trim())));
        row.unInterruptedPDP = pdp.map(text => ({ text }));
      }

      row.imageZoomFeaturePresent = [{ text: 'Yes' }];
    }
  }

  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
