
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.nameExtended && row.variantInformation) {
				let newText = '';
				row.nameExtended.forEach(item => {

					if (item.text.indexOf(row.variantInformation[0].text) > -1) {
						newText = item.text;
					} else {
						newText = item.text + ' ' + row.variantInformation[0].text
					}
				});
				row.nameExtended = [{ text: newText }];
			}
			if (row.description) {
				let text = '';
				row.description.forEach(item => {
					text += `${item.text.replace(/\n \n/g, ':')} || `;
				});
				row.description = [
					{
						text: text.slice(0, -4),
					},
				];
			}
			if (row.additionalDescBulletInfo) {
				let text = '';
				row.additionalDescBulletInfo.forEach(item => {
					text += `${item.text.replace(/\n \n/g, ':')} || `;
				});
				row.additionalDescBulletInfo = [
					{
						text: text.slice(0, -4),
					},
				];
			}
			if (row.specifications) {
				let text = '';
				row.specifications.forEach(item => {
					text = text + (text ? ' | ' : '') + item.text;
				  });
				  row.specifications = [{ text }];
			}
			if (row.manufacturerDescription) {
				let text = '';
				row.manufacturerDescription.forEach(item => {
					text += `${item.text.replace(/\n \n/g, ':')} || `;
				});
				row.manufacturerDescription = [
					{
						text: text.slice(0, -4),
					},
				];
			}
			if (row.variants) {
				let newText = [];
				row.variants.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.variants = [{ text: newText.join(" | ") }];
			}
			if (row.sku) {
				let newText = [];
				row.sku.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.sku = [{ text: newText }];
			}
			if (row.variantId) {
				let newText = [];
				row.variantId.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.variantId = [{ text: newText }];
			}
			if (row.firstVariant) {
				let newText = [];
				row.firstVariant.forEach(item => {
					newText.push(item.text.replace("Art-Nr: ", ""))
				});
				row.firstVariant = [{ text: newText }];
			}
			if (row.price) {
				let newText = '';
				row.price.forEach(item => {
					newText = item.text.replace(" *", "")
				});
				row.price = [{ text: newText }];
			}

			if (row.weightNet) {
				let newText = '';
				row.weightNet.forEach(item => {
					newText = item.text.replace("Gewicht", "").replace(":", "");
				});
				row.weightNet = [{ text: newText.trim() }];
			}
			if (row.color) {
				let newText = '';
				row.color.forEach(item => {
					newText = item.text.replace("Farbe", "").replace(":", "");
				});
				row.color = [{ text: newText.trim() }];
			}
			if (row.productOtherInformation) {
				let text = '';
				row.productOtherInformation.forEach(item => {
					text += item.text.replace(/\n \n/g, ' || ');
				});
				row.productOtherInformation = [
					{
						text: text.slice(0, -4),
					},
				];
			}
			if (row.nameExtended && row.variantInformation) {

				if (row.nameExtended[0].text.indexOf(row.variantInformation[0].text) > -1) {

				} else {
					row.nameExtended[0].text + ' ' + row.variantInformation[0].text
				}
			}
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
		.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

	data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
		el.text = clean(el.text);
	}))));

	return data;
};

module.exports = { transform };
