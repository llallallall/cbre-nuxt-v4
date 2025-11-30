import { db, schema } from '~~/server/db/db';
import { v4 as uuidv4 } from 'uuid';

import { z } from 'zod';

const facilitySchema = z.object({
    elevators: z.object({
        total: z.number(),
        passenger: z.number(),
        service: z.number(),
        shuttle: z.number(),
    }),
    parking: z.object({
        cpsExisting: z.number(),
        cpsRequired: z.number(),
        freeCpsSqm: z.number().nullable().optional(),
        freeCpsPy: z.number().nullable().optional(),
        paidParkingFee: z.number().nullable().optional(),
    }),
    materials: z.object({
        roofMaterial: z.string().nullable().optional(),
        facade: z.string().nullable().optional(),
        mechanicalElectrical: z.number().nullable().optional(),
        lighting: z.string().nullable().optional(),
        fireFighting: z.string().nullable().optional(),
    })
});

export default defineEventHandler(async (event) => {
    const { id: propertyId } = getRouterParams(event);
    const body = await readValidatedBody(event, (body) => facilitySchema.parse(body));

    if (!propertyId) {
        throw createError({ statusCode: 400, statusMessage: 'Property ID is required.' });
    }

    const dbData = {
        elevatorsTotal: body.elevators?.total ?? 0,
        elevatorsPassenger: body.elevators?.passenger ?? 0,
        elevatorsService: body.elevators?.service ?? 0,
        elevatorsFreight: body.elevators?.shuttle ?? 0,

        cpsExisting: body.parking?.cpsExisting ?? 0,
        cpsRequired: body.parking?.cpsRequired ?? 0,
        freeCpsSqm: body.parking?.freeCpsSqm,
        freeCpsPy: body.parking?.freeCpsPy,
        paidParkingFee: body.parking?.paidParkingFee,

        roofMaterial: body.materials?.roofMaterial,
        facade: body.materials?.facade,
        mechanicalElectrical: body.materials?.mechanicalElectrical,
        lighting: body.materials?.lighting,
        fireFighting: body.materials?.fireFighting,
    };

    try {
        const [updated] = await db.insert(schema.facility).values({
            id: uuidv4(),
            propertyId: propertyId,
            ...dbData
        })
            .onConflictDoUpdate({
                target: schema.facility.propertyId,
                set: dbData
            })
            .returning();

        if (!updated) {
            throw new Error('Failed to upsert facility data');
        }

        return {
            elevators: {
                total: updated.elevatorsTotal,
                passenger: updated.elevatorsPassenger,
                service: updated.elevatorsService,
                shuttle: updated.elevatorsFreight
            },
            parking: {
                cpsExisting: updated.cpsExisting,
                cpsRequired: updated.cpsRequired,
                freeCpsSqm: updated.freeCpsSqm,
                freeCpsPy: updated.freeCpsPy,
                paidParkingFee: updated.paidParkingFee
            },
            materials: {
                roofMaterial: updated.roofMaterial,
                facade: updated.facade,
                mechanicalElectrical: updated.mechanicalElectrical,
                lighting: updated.lighting,
                fireFighting: updated.fireFighting
            }
        };

    } catch (e: any) {
        console.error('Facility Update Error:', e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update facility info.',
            data: e.message
        });
    }
});
