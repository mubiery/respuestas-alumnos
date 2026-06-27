# Respuestas de alumnos - versión simple

Esta app tiene una pantalla inicial bonita con dos recuadros:

- Respuesta 1
- Respuesta 2

Cada envío se guarda en el servidor, no en la laptop del alumno.  
Por eso, si la app está publicada en un hosting, puedes ver las respuestas enviadas desde otras laptops.

## Acceso admin

En los dos recuadros escribe:

```txt
admin
admin
```

Eso abre el panel con todas las respuestas recibidas.

## Ejecutar local

```bash
npm install
npm start
```

Luego abre:

```txt
http://localhost:3000
```

No uses Live Server de VS Code para probar el backend.

## Subir a GitHub

Sube estos archivos:

```txt
server.js
package.json
public/index.html
public/app.js
README.md
.gitignore
```

No subas:

```txt
node_modules/
respuestas.jsonl
```

## Publicar para alumnos

GitHub Pages no sirve para guardar respuestas porque no ejecuta `server.js`.

Usa un hosting con Node.js, por ejemplo:

- Render
- Railway
- Fly.io
- Replit

En Render:

1. Crea un repo en GitHub.
2. Sube este proyecto.
3. En Render crea un nuevo Web Service.
4. Conecta tu repo.
5. Build command: `npm install`
6. Start command: `npm start`
7. Comparte la URL final con tus alumnos.

## Nota

Si se reinicia el hosting gratuito, algunos servicios pueden borrar archivos locales.  
Para algo permanente se recomienda base de datos, pero para una demo de clase este archivo JSONL puede bastar.