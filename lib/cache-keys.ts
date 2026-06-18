// type VersionGroupKey = {
//     apiName: string
//     name: string
//     id: number
// }

// export function createVersionGroupCacheKey({ apiName, name, id }: VersionGroupKey) {
//     const keyParts = ["versionGroup"]

//     if (apiName) keyParts.push(`apiName=${apiName}`)
//     if (name) keyParts.push(`name=${name}`)
//     if (id) keyParts.push(`id=${id}`)

//     return keyParts.join("&")
// }

// type ProductsTagKey = {
//     slug?: string
//     query?: string
// }

// export function createProductsTags({ query, slug }: ProductsTagKey) {
//     const tags = ["products"]

//     if (slug) tags.push(`category=${slug}`)
//     if (query) tags.push(`query=${query}`)

//     return tags
// }