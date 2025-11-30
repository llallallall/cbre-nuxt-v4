import type { LeaseCreatePayload, SaleCreatePayload } from '../../app/types/property.type';

/**
 * 📅 날짜 변환 유틸리티 (string | Date | null -> Date | null)
 */
export const toDateOrNull = (date: string | Date | null | undefined): string | null => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * 🏠 Lease 상세 정보 매핑 (Client camelCase -> DB camelCase for Drizzle)
 */
export const mapLeaseDetailFromClientToDrizzle = (payload: LeaseCreatePayload) => {
    return {
        leaseType: payload.leaseType,
        floor: payload.floor,
        unit: payload.unit,
        tenant: payload.tenant,

        leaseStartDate: toDateOrNull(payload.leaseStartDate),
        leaseEndDate: toDateOrNull(payload.leaseEndDate),

        gfaSqm: payload.gfaSqm,
        gfaPy: payload.gfaPy,
        nfaSqm: payload.nfaSqm,
        nfaPy: payload.nfaPy,
        effRatio: payload.effRatio,

        monthlyRent: payload.monthlyRent,
        monthlyCamf: payload.monthlyCamf,
        deposit: payload.deposit,

        rentMonthlyPy: payload.rentMonthlyPy,
        camfMonthlyPy: payload.camfMonthlyPy,
        depositPy: payload.depositPy,

        iod: payload.iod,
        gdm: payload.gdm,
        noc: payload.noc,

        leaseTermYear: payload.leaseTermYear,
        rentFreeType: payload.rentFreeType,
        rentFreeMonth: payload.rentFreeMonth,

        effectiveNoc: payload.effectiveNoc,
        fitOut: payload.fitOut ? Number(payload.fitOut) : null,

        tiAmountKrw: payload.tiAmountKrw,
        tiAmountNfaPy: payload.tiAmountNfaPy,

        totalFreeRentPeriodMonth: payload.totalFreeRentPeriodMonth,
        totalOccupyingPeriodYear: payload.totalOccupyingPeriodYear,
        totalFreeRentOccupyingYear: payload.totalFreeRentOccupyingYear,

        monthlyCashSupportGfa: payload.monthlyCashSupportGfa,
        allInEffectiveRentMonthlyPy: payload.allInEffectiveRentMonthlyPy,
        allInNoc: payload.allInNoc
    };
};

/**
 * 💰 Sale 상세 정보 매핑 (Client camelCase -> DB camelCase for Drizzle)
 */
export const mapSaleDetailFromClientToDrizzle = (payload: SaleCreatePayload) => {
    return {
        saleType: payload.saleType,
        gfaSqm: payload.gfaSqm,
        nfaSqm: payload.nfaSqm,
        priceKrw: payload.priceKrw,
        pricePerGfa: payload.pricePerGfa,
        pricePerNfa: payload.pricePerNfa,
        estCapRate: payload.estCapRate,
        estDiscountRate: payload.estDiscountRate,
        buyer: payload.buyer,
        seller: payload.seller,
        remarks: payload.remarks
    };
};
