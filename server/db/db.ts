import { useDb } from './drizzle';
import * as schema from './schema';

// db client와 schema를 한 번에 내보냅니다.
export const db = useDb;
export { schema };