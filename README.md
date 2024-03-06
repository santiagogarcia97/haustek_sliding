## Levantar proyecto

1. Inicia sesión en el repositorio del chino usando las credenciales a continuación:
   ```
   npm login --registry http://gogs.thinkerx.com:4873
   ```
   Credenciales:
   - usuario: repo-npm2 
   - contraseña: repo-npm200717
<br>
2. Instala el paquete `webcc` desde el repositorio del chino. Verifica el archivo `package.json` para ver qué versión de `webcc` está instalada y ejecuta el comando correspondiente:
   ```
   npm i webcc --registry http://gogs.thinkerx.com:4873
   npm i webcc@v1.0.2-beta.0 --registry http://gogs.thinkerx.com:4873
   ```
<br>

3. Instala el resto de las dependencias desde npm:
   ```
   npm install
   ```

<br>
token: eyJuYW1lIjoiUmhpbm8iLCJzdG0iOjE2Njc0MzM2MDAwMDAsImV4cCI6MTY5OTA1NjAwMDAwMCwibGl0ZSI6ZmFsc2V9.f923c735ceba1c42e678b3586ea37fde