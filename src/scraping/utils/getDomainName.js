export function obtainDomainName (url) {
  const regex = /^https?:\/\/(?:www\.)?([^/]+)\./
  const coincidencia = url.match(regex)
  return coincidencia ? coincidencia[1] : null
}
