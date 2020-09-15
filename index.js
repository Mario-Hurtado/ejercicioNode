const http = require("http");
const fs = require("fs");
const axios = require("axios");
const url = require("url");

const urlClientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";
const urlProveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

const render = (ruta, callback) => {
  fs.readFile("./index.html", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let contenidoPagina = String(data);
      let reemplazoTexto = "";
      let url = "";
      if (ruta == "Proveedores") {
        url = urlProveedores;
      } else {
        url = urlClientes;
      }

      axios
        .get(url)
        .then((response) => {
          response.data.forEach((persona) => {
            reemplazoTexto += `<tr>
            <th> ${
              ruta == "Clientes" ? persona.idCliente : persona.idproveedor
            }</th>
            <td>${
              ruta == "Clientes"
                ? persona.NombreCompania
                : persona.nombrecompania
            } </td>
            <td>${
              ruta == "Clientes"
                ? persona.NombreContacto
                : persona.nombrecontacto
            }</td>
            </tr>`;
          });
        })
        .then(() => {
          contenidoPagina = contenidoPagina.replace(
            "{{replace_contenido}}",
            reemplazoTexto
          );
          contenidoPagina = contenidoPagina.replace("{{replace_nombre}}", ruta);
          contenidoPagina = contenidoPagina.replace("{{replace_tabla}}", ruta);
          callback(contenidoPagina);
        });
    }
  });
};

http
  .createServer((request, response) => {
    let pathname = url.parse(request.url).pathname;
    if (pathname == "/proveedores") {
      render("Proveedores", (data) => {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(String(data));
      });
    }
    if (pathname == "/clientes") {
      render("Clientes", (data) => {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(String(data));
      });
    }
  })
  .listen(8081);
