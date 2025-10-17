require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getPool, sql } = require('./db/connection');

const app = express();
app.use(cors());
app.use(express.json());

// Asegura la carpeta uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer para guardar archivos en disco
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Servir archivos estáticos (para ver imágenes)
app.use('/uploads', express.static(uploadDir));

// Endpoint para subir imagen
app.post('/api/photos', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Archivo requerido' });
  const descripcion = req.body.descripcion || null;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('ruta', sql.NVarChar(260), `/uploads/${req.file.filename}`)
      .input('nombre', sql.NVarChar(200), req.file.originalname)
      .input('mime', sql.NVarChar(100), req.file.mimetype)
      .input('tam', sql.BigInt, req.file.size)
      .input('descripcion', sql.NVarChar(500), descripcion)
      .query(`
        INSERT INTO Fotos (ruta, nombre_original, mime_type, tamanio_bytes, descripcion, fecha_creacion)
        OUTPUT inserted.id
        VALUES (@ruta, @nombre, @mime, @tam, @descripcion, SYSUTCDATETIME())
      `);

    return res.json({ id: result.recordset[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al guardar en BD' });
  }
});

// (Opcional) listar
app.get('/api/photos', async (_req, res) => {
  try {
    const pool = await getPool();
    const rs = await pool.request().query('SELECT TOP 50 * FROM Fotos ORDER BY id DESC');
    res.json(rs.recordset);
  } catch (e) {
    res.status(500).json({ message: 'Error al consultar' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));