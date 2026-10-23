// JSON.stringify no escapa "<", así que un título o texto con "</script>"
// (por ejemplo, un post traído de la NASA o editado en /admin) cerraría la
// etiqueta <script type="application/ld+json"> y lo que siga correría como
// HTML. Escapar "<" lo evita sin cambiar el JSON que leen los buscadores.
export function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
