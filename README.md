# Planning familiar colaborativo · Familia Laviña Pérez

Versión web compartida del planning familiar, preparada para GitHub + Vercel + Supabase y sin dependencias npm.

## Incluye
- contraseña familiar validada en servidor;
- cookie de sesión HTTP-only;
- lunes-domingo con desayuno, comida y cena editables;
- checks compartidos;
- notas por día;
- lista de la compra compartida;
- despensa familiar compartida con estados Hay / Queda poco / Falta;
- categorías y cantidades en despensa;
- botón para pasar un producto de despensa a la lista de la compra;
- nombre de quién edita;
- sincronización automática cada 3 segundos;
- móvil, tablet y ordenador;
- 100% compatible con el plan gratuito de Vercel/Supabase para uso familiar normal.

## Paso 1 · Supabase
1. Crea un proyecto gratuito en Supabase.
2. Abre **SQL Editor**.
3. Ejecuta el contenido de `supabase-schema.sql`.
4. Guarda Project URL y la secret key.

## Paso 2 · Vercel
1. Add New > Project.
2. Importa este repositorio.
3. Añade estas Environment Variables:
   - `APP_PASSWORD`
   - `SESSION_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy.

No pongas jamás `SUPABASE_SERVICE_ROLE_KEY` como variable `NEXT_PUBLIC_*` ni dentro de `app.js`.

## Resultado
Obtendrás una URL tipo `planning-familiar.vercel.app`. Cualquier persona con la contraseña verá el mismo planning y los cambios del resto aparecerán automáticamente.
