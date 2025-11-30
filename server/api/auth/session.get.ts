export default defineEventHandler(async (event) => {
    return await getUserSession(event);
});
