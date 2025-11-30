import { pgTable, uniqueIndex, foreignKey, text, timestamp, varchar, boolean, doublePrecision, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { relations } from "drizzle-orm/relations";

export const floorFlanType = pgEnum("FloorFlanType", ['LOGITUDINALSECTION', 'CROSSSECTION', 'UPPERSECTION', 'BASEMENTSECTION'])
export const floorUseType = pgEnum("FloorUseType", ['ROOM', 'OFFICE', 'LOW', 'CONSTANT'])
export const historyType = pgEnum("HistoryType", ['COMPLETION', 'RENOVATION'])
export const leaseType = pgEnum("LeaseType", ['ASKING', 'ACTUAL'])
export const levelType = pgEnum("LevelType", ['UPPER', 'BASEMENT'])
export const rentFreeType = pgEnum("RentFreeType", ['PerYear', 'PerTerm'])
export const role = pgEnum("Role", ['USER', 'ADMIN', 'DEVELOPER'])
export const roomUseType = pgEnum("RoomUseType", ['DRY', 'COLD', 'OFFICE', 'OTHERS'])
export const saleType = pgEnum("SaleType", ['ENBLOC', 'PARTIAL'])
export const temperatureType = pgEnum("TemperatureType", ['ROOM', 'LOW', 'CONSTANT'])
export const transactionType = pgEnum("TransactionType", ['SALE', 'LEASE'])


export const session = pgTable("Session", {
  id: text().primaryKey().notNull(),
  sessionToken: text().notNull(),
  userId: text().notNull(),
  expires: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
  uniqueIndex("Session_sessionToken_key").using("btree", table.sessionToken.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "Session_userId_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const profile = pgTable("Profile", {
  id: text().primaryKey().notNull(),
  userId: text().notNull(),
  imageUrl: varchar("image_url"),
  company: varchar(),
  branch: varchar(),
  department: varchar(),
  title: varchar(),
  useProfileImage: boolean("use_profile_image").default(false).notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Profile_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "Profile_userId_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const sector = pgTable("Sector", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
});

export const property = pgTable("Property", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  sectorId: text("sector_id").notNull(),
  subsectorId: text("subsector_id"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  image: varchar({ length: 50 }),
  transactionId: varchar("transaction_id", { length: 50 }),
}, (table) => [
  foreignKey({
    columns: [table.sectorId],
    foreignColumns: [sector.id],
    name: "Property_sector_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    columns: [table.subsectorId],
    foreignColumns: [subSector.id],
    name: "Property_subsector_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const verificationToken = pgTable("VerificationToken", {
  identifier: text().notNull(),
  token: text().notNull(),
  expires: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
  uniqueIndex("VerificationToken_identifier_token_key").using("btree", table.identifier.asc().nullsLast().op("text_ops"), table.token.asc().nullsLast().op("text_ops")),
  uniqueIndex("VerificationToken_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
]);

export const subSector = pgTable("SubSector", {
  id: text().primaryKey().notNull(),
  sectorId: text("sector_id").notNull(),
  name: text().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.sectorId],
    foreignColumns: [sector.id],
    name: "SubSector_sector_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const location = pgTable("Location", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  addressFull: text("address_full"),
  addressFullJibun: text("address_full_jibun"),
  addressProvince: text("address_province"),
  addressCity: text("address_city"),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Location_property_id_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Location_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const scale = pgTable("Scale", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  noOfBuildings: integer("no_of_buildings").default(0).notNull(),
  upperLevels: integer("upper_levels").default(0).notNull(),
  basementLevels: integer("basement_levels").default(0).notNull(),
  gfaSqm: doublePrecision("gfa_sqm"),
  gfaPy: doublePrecision("gfa_py"),
  nfaSqm: doublePrecision("nfa_sqm"),
  nfaPy: doublePrecision("nfa_py"),
  siteAreaSqm: doublePrecision("site_area_sqm"),
  siteAreaPy: doublePrecision("site_area_py"),
  grossLeasableAreaSqm: doublePrecision("gross_leasable_area_sqm"),
  grossLeasableAreaPy: doublePrecision("gross_leasable_area_py"),
  netLeasableAreaSqm: doublePrecision("net_leasable_area_sqm"),
  netLeasableAreaPy: doublePrecision("net_leasable_area_py"),
  floorAreaRatioExisting: doublePrecision("floor_area_ratio_existing"),
  floorAreaRatioPermitted: doublePrecision("floor_area_ratio_permitted"),
  buildingCoverageRatioExisting: doublePrecision("building_coverage_ratio_existing"),
  buildingCoverageRatioPermitted: doublePrecision("building_coverage_ratio_permitted"),
  floorPlateSqm: doublePrecision("floor_plate_sqm"),
  floorPlatePy: doublePrecision("floor_plate_py"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Scale_property_id_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Scale_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const user = pgTable("User", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  email: text(),
  hashedPassword: varchar().notNull(),
  emailVerified: timestamp({ precision: 3, mode: 'string' }),
  image: text(),
  role: role().default('USER'),
}, (table) => [
  uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const accessibility = pgTable("Accessibility", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  distanceToIc: text("distance_to_ic"),
  timeTakenToCityHall: text("time_taken_to_city_hall"),
  timeTakenToSubway: text("time_taken_to_subway"),
  nearbyFacilities: text("nearby_facilities"),
  nearbyAttractions: text("nearby_attractions"),
  nearbyPlaces: text("nearby_places"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Accessibility_property_id_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Accessibility_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const profitability = pgTable("Profitability", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  grade: text(),
  effectiveRatio: doublePrecision("effective_ratio"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Profitability_property_id_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Profitability_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const warehouse = pgTable("Warehouse", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  temperatureType: temperatureType("temperature_type").notNull(),
  ratio: doublePrecision(),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Warehouse_property_id_temperature_type_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops"), table.temperatureType.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Warehouse_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const facility = pgTable("Facility", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  elevatorsTotal: integer("elevators_total").default(0).notNull(),
  elevatorsPassenger: integer("elevators_passenger").default(0).notNull(),
  elevatorsService: integer("elevators_service").default(0).notNull(),
  elevatorsFreight: integer("elevators_freight").default(0).notNull(),
  cpsExisting: integer("cps_existing").default(0).notNull(),
  cpsRequired: integer("cps_required").default(0).notNull(),
  freeCpsSqm: doublePrecision("free_cps_sqm"),
  freeCpsPy: doublePrecision("free_cps_py"),
  paidParkingFee: integer("paid_parking_fee"),
  roofMaterial: text("roof_material"),
  facade: text(),
  mechanicalElectrical: integer("mechanical_electrical"),
  lighting: text(),
  fireFighting: text("fire_fighting"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Facility_property_id_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Facility_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const history = pgTable("History", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  year: text().notNull(),
  type: historyType().notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "History_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const floor = pgTable("Floor", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  type: levelType(),
  floor: integer(),
  ceilingHeight: doublePrecision("ceiling_height"),
  ceilingHeightUnit: text("ceiling_height_unit").default('m'),
  floorLoad: doublePrecision("floor_load"),
  floorLoadUnit: text("floor_load_unit").default('ton/㎡'),
  truckBerths: integer("truck_berths"),
  use: floorUseType(),
  totalAreaSqm: doublePrecision("total_area_sqm"),
  totalAreaPy: doublePrecision("total_area_py"),
  grossLeasableAreaSqm: doublePrecision("gross_leasable_area_sqm"),
  grossLeasableAreaPy: doublePrecision("gross_leasable_area_py"),
  netLeasableAreaSqm: doublePrecision("net_leasable_area_sqm"),
  netLeasableAreaPy: doublePrecision("net_leasable_area_py"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Floor_property_id_type_floor_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops"), table.type.asc().nullsLast().op("text_ops"), table.floor.asc().nullsLast().op("int4_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Floor_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const propertyImageFile = pgTable("PropertyImageFile", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  main: boolean().default(false).notNull(),
  fileUuid: text("file_uuid"),
  fileName: text("file_name"),
  fileKey: text("file_key"),
  fileUrl: text("file_url"),
  fileContentType: text("file_content_type"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("PropertyImageFile_property_id_file_uuid_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops"), table.fileUuid.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "PropertyImageFile_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const propertyBrochureFile = pgTable("PropertyBrochureFile", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  fileUuid: text("file_uuid"),
  fileName: text("file_name"),
  fileKey: text("file_key"),
  fileUrl: text("file_url"),
  fileContentType: text("file_content_type"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("PropertyBrochureFile_property_id_file_uuid_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops"), table.fileUuid.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "PropertyBrochureFile_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const floorPlanFile = pgTable("FloorPlanFile", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  type: floorFlanType().notNull(),
  floor: integer(),
  fileUuid: text("file_uuid"),
  fileName: text("file_name"),
  fileKey: text("file_key"),
  fileUrl: text("file_url"),
  fileContentType: text("file_content_type"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("FloorPlanFile_property_id_type_floor_key").using("btree", table.propertyId.asc().nullsLast().op("text_ops"), table.type.asc().nullsLast().op("text_ops"), table.floor.asc().nullsLast().op("int4_ops")),
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "FloorPlanFile_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const transaction = pgTable("Transaction", {
  id: text().primaryKey().notNull(),
  propertyId: text("property_id").notNull(),
  type: transactionType().notNull(),
  year: text().notNull(),
  quarter: text().notNull(),
  executionDate: timestamp("execution_date", { precision: 6, mode: 'string' }).notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  date: varchar({ length: 50 }),
  saleid: varchar({ length: 50 }),
}, (table) => [
  foreignKey({
    columns: [table.propertyId],
    foreignColumns: [property.id],
    name: "Transaction_property_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const sale = pgTable("Sale", {
  id: text().primaryKey().notNull(),
  transactionId: text("transaction_id"),
  saleType: saleType("sale_type").notNull(),
  gfaSqm: doublePrecision("gfa_sqm"),
  nfaSqm: doublePrecision("nfa_sqm"),
  priceKrw: integer("price_krw"),
  pricePerGfa: integer("price_per_gfa"),
  pricePerNfa: integer("price_per_nfa"),
  estCapRate: doublePrecision("est_cap_rate"),
  estDiscountRate: doublePrecision("est_discount_rate"),
  buyer: text(),
  seller: text(),
  remarks: text(),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Sale_transaction_id_key").using("btree", table.transactionId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.transactionId],
    foreignColumns: [transaction.id],
    name: "Sale_transaction_id_fkey"
  }).onUpdate("cascade").onDelete("set null"),
]);

export const lease = pgTable("Lease", {
  id: text().primaryKey().notNull(),
  transactionId: text("transaction_id"),
  leaseType: leaseType("lease_type"),
  floor: text(),
  unit: text(),
  tenant: text(),
  leaseStartDate: timestamp("lease_start_date", { precision: 6, mode: 'string' }),
  leaseEndDate: timestamp("lease_end_date", { precision: 6, mode: 'string' }),
  gfaSqm: doublePrecision("gfa_sqm"),
  gfaPy: doublePrecision("gfa_py"),
  nfaSqm: doublePrecision("nfa_sqm"),
  nfaPy: doublePrecision("nfa_py"),
  effRatio: doublePrecision("eff_ratio"),
  monthlyRent: integer("monthly_rent"),
  monthlyCamf: integer("monthly_camf"),
  deposit: integer(),
  rentMonthlyPy: integer("rent_monthly_py"),
  camfMonthlyPy: integer("camf_monthly_py"),
  depositPy: integer("deposit_py"),
  iod: doublePrecision(),
  gdm: doublePrecision(),
  noc: doublePrecision(),
  leaseTermYear: integer("lease_term_year"),
  rentFreeType: rentFreeType("rent_free_type"),
  rentFreeMonth: integer("rent_free_month"),
  effectiveNoc: doublePrecision("effective_noc"),
  fitOut: integer("fit_out"),
  tiAmountKrw: doublePrecision("ti_amount_krw"),
  tiAmountNfaPy: doublePrecision("ti_amount_nfa_py"),
  totalFreeRentPeriodMonth: integer("total_free_rent_period_month"),
  totalOccupyingPeriodYear: doublePrecision("total_occupying_period_year"),
  totalFreeRentOccupyingYear: doublePrecision("total_free_rent_occupying_year"),
  monthlyCashSupportGfa: doublePrecision("monthly_cash_support_gfa"),
  allInEffectiveRentMonthlyPy: doublePrecision("all_in_effective_rent_monthly_py"),
  allInNoc: doublePrecision("all_in_noc"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  uniqueIndex("Lease_transaction_id_key").using("btree", table.transactionId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.transactionId],
    foreignColumns: [transaction.id],
    name: "Lease_transaction_id_fkey"
  }).onUpdate("cascade").onDelete("set null"),
]);

export const account = pgTable("Account", {
  id: text().primaryKey().notNull(),
  userId: text().notNull(),
  type: text().notNull(),
  provider: text().notNull(),
  providerAccountId: text().notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text(),
  idToken: text("id_token"),
  sessionState: text("session_state"),
  subscribed: boolean().default(false).notNull(),
}, (table) => [
  uniqueIndex("Account_provider_providerAccountId_key").using("btree", table.provider.asc().nullsLast().op("text_ops"), table.providerAccountId.asc().nullsLast().op("text_ops")),
  uniqueIndex("Account_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
    name: "Account_userId_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);

export const floorPartial = pgTable("FloorPartial", {
  id: text().primaryKey().notNull(),
  floorId: text("floor_id").notNull(),
  unitNumber: text("unit_number"),
  tenant: text(),
  leaseAreaSqm: doublePrecision("lease_area_sqm"),
  leaseAreaPy: doublePrecision("lease_area_py"),
  tenantEquipment: boolean("tenant_equipment").default(false).notNull(),
  tenantUse: roomUseType("tenant_use"),
  leaseStartDate: timestamp("lease_start_date", { precision: 6, mode: 'string' }),
  leaseEndDate: timestamp("lease_end_date", { precision: 6, mode: 'string' }),
  depositKrw: integer("deposit_krw"),
  monthlyRentPerPy: doublePrecision("monthly_rent_per_py"),
  monthlyRent: integer("monthly_rent"),
  monthlyManagementPerPy: doublePrecision("monthly_management_per_py"),
  monthlyManagementFee: integer("monthly_management_fee"),
  increaseConditionsForDeposit: text("increase_conditions_for_deposit"),
  increaseConditionsForRent: text("increase_conditions_for_rent"),
  increaseConditionsForManagementFee: text("increase_conditions_for_management_fee"),
  rentFree: text("rent_free"),
  fitOut: text("fit_out"),
  createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  foreignKey({
    columns: [table.floorId],
    foreignColumns: [floor.id],
    name: "FloorPartial_floor_id_fkey"
  }).onUpdate("cascade").onDelete("cascade"),
]);



export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  profiles: many(profile),
  accounts: many(account),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id]
  }),
}));

export const propertyRelations = relations(property, ({ one, many }) => ({
  sector: one(sector, {
    fields: [property.sectorId],
    references: [sector.id]
  }),
  subSector: one(subSector, {
    fields: [property.subsectorId],
    references: [subSector.id]
  }),
  locations: many(location),
  scales: many(scale),
  accessibilities: many(accessibility),
  profitabilities: many(profitability),
  warehouses: many(warehouse),
  facilities: many(facility),
  histories: many(history),
  floors: many(floor),
  propertyImageFiles: many(propertyImageFile),
  propertyBrochureFiles: many(propertyBrochureFile),
  floorPlanFiles: many(floorPlanFile),
  transactions: many(transaction),
}));

export const sectorRelations = relations(sector, ({ many }) => ({
  properties: many(property),
  subSectors: many(subSector),
}));

export const subSectorRelations = relations(subSector, ({ one, many }) => ({
  properties: many(property),
  sector: one(sector, {
    fields: [subSector.sectorId],
    references: [sector.id]
  }),
}));

export const locationRelations = relations(location, ({ one }) => ({
  property: one(property, {
    fields: [location.propertyId],
    references: [property.id]
  }),
}));

export const scaleRelations = relations(scale, ({ one }) => ({
  property: one(property, {
    fields: [scale.propertyId],
    references: [property.id]
  }),
}));

export const accessibilityRelations = relations(accessibility, ({ one }) => ({
  property: one(property, {
    fields: [accessibility.propertyId],
    references: [property.id]
  }),
}));

export const profitabilityRelations = relations(profitability, ({ one }) => ({
  property: one(property, {
    fields: [profitability.propertyId],
    references: [property.id]
  }),
}));

export const warehouseRelations = relations(warehouse, ({ one }) => ({
  property: one(property, {
    fields: [warehouse.propertyId],
    references: [property.id]
  }),
}));

export const facilityRelations = relations(facility, ({ one }) => ({
  property: one(property, {
    fields: [facility.propertyId],
    references: [property.id]
  }),
}));

export const historyRelations = relations(history, ({ one }) => ({
  property: one(property, {
    fields: [history.propertyId],
    references: [property.id]
  }),
}));

export const floorRelations = relations(floor, ({ one, many }) => ({
  property: one(property, {
    fields: [floor.propertyId],
    references: [property.id]
  }),
  floorPartials: many(floorPartial),
}));

export const propertyImageFileRelations = relations(propertyImageFile, ({ one }) => ({
  property: one(property, {
    fields: [propertyImageFile.propertyId],
    references: [property.id]
  }),
}));

export const propertyBrochureFileRelations = relations(propertyBrochureFile, ({ one }) => ({
  property: one(property, {
    fields: [propertyBrochureFile.propertyId],
    references: [property.id]
  }),
}));

export const floorPlanFileRelations = relations(floorPlanFile, ({ one }) => ({
  property: one(property, {
    fields: [floorPlanFile.propertyId],
    references: [property.id]
  }),
}));

export const transactionRelations = relations(transaction, ({ one, many }) => ({
  property: one(property, {
    fields: [transaction.propertyId],
    references: [property.id]
  }),
  sales: many(sale),
  leases: many(lease),
}));

export const saleRelations = relations(sale, ({ one }) => ({
  transaction: one(transaction, {
    fields: [sale.transactionId],
    references: [transaction.id]
  }),
}));

export const leaseRelations = relations(lease, ({ one }) => ({
  transaction: one(transaction, {
    fields: [lease.transactionId],
    references: [transaction.id]
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  }),
}));

export const floorPartialRelations = relations(floorPartial, ({ one }) => ({
  floor: one(floor, {
    fields: [floorPartial.floorId],
    references: [floor.id]
  }),
}));