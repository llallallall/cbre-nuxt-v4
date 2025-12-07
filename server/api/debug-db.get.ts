import { db } from '~~/server/db/db'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    try {
        // 0. Environment Check
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL is not defined in the environment variables.');
        }

        // 1. Connectivity Check: Simple SELECT 1
        // This confirms network reachability and basic auth
        const connectionResult = await db.execute(sql`SELECT 1 as connected`)

        // 2. Schema Check: Try to fetch one record from 'property' table
        // This confirms if migrations have been run
        let tableCheck = null
        try {
            tableCheck = await db.query.property.findFirst({
                columns: { id: true, name: true }
            })
        } catch (tableError: any) {
            throw new Error(`Connection OK but Table Query Failed: ${tableError.message}`)
        }

        return {
            status: 'success',
            message: 'Database connection and schema are valid.',
            debug: {
                host: dbUrl.split('@')[1]?.split(':')[0] || 'unknown',
                database: dbUrl.split('/').pop()?.split('?')[0] || 'unknown'
            },
            connection: connectionResult.rows ? connectionResult.rows[0] : connectionResult,
            sampleData: tableCheck
        }

    } catch (error: any) {
        // Return the full error detail to the browser for debugging
        return {
            status: 'error',
            code: error.code, // Postgres error code
            message: error.message,
            detail: error.stack,
            hint: 'Check DATABASE_URL, Docker Network, and if Migrations are applied.',
            env: {
                DATABASE_URL: process.env.DATABASE_URL ? (process.env.DATABASE_URL.substring(0, 15) + '...') : 'UNDEFINED',
                NODE_ENV: process.env.NODE_ENV
            }
        }
    }
})
