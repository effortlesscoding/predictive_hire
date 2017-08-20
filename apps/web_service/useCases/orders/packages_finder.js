
class PackagesFinder {
  async getPackages(productCode: string) {
    return database.get('packages', { productCode: productCode})
      .then((packages: Array<PackageType>) => packages)
      .catch((e) => throw e)
  }
}
