/* A wrong /api/ path answers JSON 404, not the SPA's index.html with a 200. */
import { json } from '../_lib/http.ts'

export const onRequest = () => json({ error: 'not_found' }, 404)
