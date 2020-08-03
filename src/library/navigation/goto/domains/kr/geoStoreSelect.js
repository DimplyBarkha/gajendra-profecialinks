const findStorebyId = (storeId) => {
  console.log('Looking for store...');
  const desiredStoreButton = document.querySelector(`div.ModalitySelector--StoreSearchResult button[data-testid=SelectStore-${storeId}]`);
  if (desiredStoreButton) {
    desiredStoreButton.click();
  } else {
    throw new Error("Couldn't find a store with that id");
  }
};

module.exports = {
  findStorebyId,
};
