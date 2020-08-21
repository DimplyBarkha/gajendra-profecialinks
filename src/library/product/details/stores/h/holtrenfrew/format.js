/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    const cleanUp = text => text.toString()
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
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  
    const prefixImageWithDomain = (image) => {
      const domainPrefix = "https:";
      const { text } = image;
      return { ...image, text: domainPrefix + text };
    }

    const prefixVariantWithDomain = (variantObject) => {
      const domainPrefix = "https://www.holtrenfrew.com";
      const { text } = variantObject;
      return { ...variantObject, text: domainPrefix + text };
    }

    const getVariantId = (variantObject) => {
      const regex = /.*p\/(.*)/;
      const { text } = variantObject;
      return { ...variantObject, text: text.replace(regex,'$1') };
    }

    for (const { group } of data) {
      for (const row of group) {
        // Added code as brand is not available directly on the webpage
        if (row.descriptionBullets) {
            const text = [];
            text.push({ text: row.descriptionBullets.length });
            row.descriptionBullets = text;
        }
        if(row.description) {            
            row.description[0].text = row.description[0].text.replace(/(\n\s*){2,}/g, ' || ');            
            row.description[0].text = cleanUp(row.description[0].text);
        }
        if(row.alternateImages) {
          row.alternateImages.splice(0, 1);

          row.alternateImages = row.alternateImages.map(prefixImageWithDomain);
          
          const text = [];
          text.push({ text: row.alternateImages.length });
          row.secondaryImageTotal = text;
        }
        if(row.image) {
          row.image = row.image.map(prefixImageWithDomain);
        }
        
        if(row.imageZoomFeaturePresent) {
          row.imageZoomFeaturePresent[0].text = row.imageZoomFeaturePresent ? "Yes" : "No";
        }

        if(row.variantUrl) row.variantUrl = row.variantUrl.map(prefixVariantWithDomain);

        if(row.variantId) row.variantId = row.variantId.map(getVariantId);

        if(row.variantInformation) {
          let str = [];
          row.variantInformation.forEach((variantInfo) => {
            str.push(variantInfo.text);
          });
          
          row.variantInformation = [{text: str.join(' | ')}];
        }

        if(row.variants) {
          let str = [];
          row.variants = row.variants.map(getVariantId);
          row.variants.forEach((variant) => {
            str.push(variant.text);
          });
          
          row.variants = [{text: str.join(' | ')}];
        }

        if ((row.name && row.brandText)) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text + ' - ' + row.color[0].text}];
        }
        
        if(row.weightNet) {
          let [ text ] = row.weightNet;
          text = text.text.match(/Weight:\s[0-9]+(\.[0-9]+)?(\s)?([a-zA-Z]+)/g)[0];
          text = text.replace(/.*?:\s*(.*)/, '$1');
          row.weightNet[0].text = text;
        }
      }
    }
    return data;
  };
  module.exports = { transform };