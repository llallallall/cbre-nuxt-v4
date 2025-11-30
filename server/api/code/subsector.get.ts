import { db, schema } from '~~/server/db/db';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async () => {
    const result = await db.select({
        id: schema.subSector.id,
        sectorId: schema.subSector.sectorId,
        name: schema.subSector.name,
    })
        .from(schema.subSector)
        .orderBy(asc(schema.subSector.name));

    return result;
});
