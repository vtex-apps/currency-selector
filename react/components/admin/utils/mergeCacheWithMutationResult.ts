export const mergeCacheWithMutationResult = (
  cachedBindingDetails: CurrencySelectorAdminConfig,
  updatedBindingDetails: CurrencySelectorAdminConfig
): CurrencySelectorAdminConfig => {
  return cachedBindingDetails.bindingId === updatedBindingDetails.bindingId
    ? updatedBindingDetails
    : cachedBindingDetails
}
