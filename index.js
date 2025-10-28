
//SE DECLARA UN IMPORT DEL PAQUETE EXPRESS Y SE PONEN () PORQUE ES FUNCÓN
const app = require('express')();
const PORT = 8080;

//
// ¡Levanta el servidor!
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});

//ESTO HACE LLAMAR LA API EN UN PUERTO ESPECIFICO
app.get('/tshirt', (req, res) => {
    res.status (200).send({
        //esto es objeto javascript, se manda como respuesta en formato JSON
        ca: 'o',
        size: 'large'
    })
});
