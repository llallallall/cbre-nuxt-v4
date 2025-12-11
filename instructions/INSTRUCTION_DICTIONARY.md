# 📖 i18n Dictionary & Terminology Standard

Based on `app/context/용어사전.xlsx`.
This document serves as the **Single Source of Truth** for UI terminology and i18n keys.

---

## 1. Naming Convention

*   **Format**: `camelCase` for properties, `snake_case` or `kebab-case` for keys (follow existing project pattern: `section.key`).
*   **Structure**: `[domain].[subcategory].[field]`
    *   Example: `property.area.gfa`, `lease.cost.rent`

---

## 2. Global Terminology Map

### A. General Property Info (`property.*`)

| Content Key | Korean (Standard) | English (Standard) | Excel Header (Source) |
| :--- | :--- | :--- | :--- |
| `property.id` | 자산 ID | Asset ID | Asset ID |
| `property.name_ko` | 자산명 (국문) | Asset Name (KOR) | Asset Name (KOR) |
| `property.name_en` | 자산명 (영문) | Asset Name (ENG) | Asset Name (ENG) |
| `property.status` | 상태 | Status | Status |
| `property.grade` | 등급 | Grade | Grade |
| `property.sector` | 자산 유형 | Sector | Sector |
| `property.sub_sector` | 세부 유형 | Sub Sector | Sub Sector |
| `property.region` | 권역 | Region | Region |
| `property.district` | 지역 (구) | District | District |
| `property.city` | 도시 | City | City |
| `property.province` | 도/시 | Province | Province |
| `property.address` | 주소 | Full Address | Full Address |
| `property.built_year` | 준공년도 | Year Built | Year Built |
| `property.reno_year` | 리모델링 연도 | Reno Year | Reno Year |
| `property.completion_date` | 준공일 | Completion Date | - |

### B. Area & Measurement (`property.area.*`)

| Content Key | Korean | English | Excel Header |
| :--- | :--- | :--- | :--- |
| `property.area.gfa` | 연면적 | GFA | - |
| `property.area.nfa` | 전용면적 | NFA | - |
| `property.area.site` | 대지면적 | Site Area | - |
| `property.area.gfa_sqm` | 연면적 (m²) | GFA (sqm) | 연면적(제곱미터) |
| `property.area.nfa_sqm` | 전용면적 (m²) | NFA (sqm) | 전용면적(제곱미터) |
| `property.area.site_sqm` | 대지면적 (m²) | Site Area (sqm) | 대지면적(제곱미터) |
| `property.area.gfa_py` | 연면적 (평) | GFA (py) | 연면적(평) |
| `property.area.nfa_py` | 전용면적 (평) | NFA (py) | 전용면적(평) |
| `property.area.site_py` | 대지면적 (평) | Site Area (py) | 대지면적(평) |
| `property.area.eff_ratio` | 전용률 | Eff. Ratio | - |

### C. Location & Transport (`property.location.*`)

| Content Key | Korean | English | Excel Header |
| :--- | :--- | :--- | :--- |
| `property.location.dist_ic` | IC 거리 (km) | Dist. I.C. (km) | 해당자산 - 근접 I.C. 사이 거리 (km) |
| `property.location.dist_cityhall` | 시청 거리 (km) | Dist. City Hall (km) | 해당자산 - 근접 시청사이 거리 (km) |
| `property.location.time_ic` | IC 소요시간 (분) | Time I.C. (min) | I.C. 도달 소요시간 (분)* |
| `property.location.time_cityhall` | 시청 소요시간 (분) | Time City Hall (min) | 시청 도달 소요시간 (분)** |

### D. Facility (`property.facility.*`)

| Content Key | Korean | English | Excel Header |
| :--- | :--- | :--- | :--- |
| `property.facility.parking` | 주차대수 | Parking (Cars) | 주차가능대수 (CPS) |
| `property.facility.elevator` | 엘리베이터 | Elevator | - |
| `property.facility.floor_u` | 지상 층수 | Upper Floors | - |
| `property.facility.floor_b` | 지하 층수 | Basement Floors | - |

### E. Transaction & Lease (`trans.*`, `lease.*`)

| Content Key | Korean | English | Excel Header |
| :--- | :--- | :--- | :--- |
| `trans.type` | 거래 유형 | Transaction Type | - |
| `trans.year` | 거래/임대 연도 | Year | 거래/임대 연도 |
| `trans.quarter` | 거래/임대 분기 | Quarter | 거래/임대 분기 |
| `trans.date_full` | 거래 발생 시기 | Full Date | 매매/임대 발생 시기 |
| `lease.occupancy` | 임대율 / 입주율 | Occupancy | 입주율 |
| `lease.units_avail` | 공실 수 | Units Available | 입주가능 층수/호실 |
| `lease.rent` | 명목 임대료 | Face Rent | 임대료 |
| `lease.cam` | 관리비 | CAM | 관리비 |
| `lease.deposit` | 보증금 | Deposit | 보증금 |
| `lease.rent_free_type` | 렌트프리 유형 | Rent Free Type | 렌트프리 유형 |
| `lease.rent_free` | 렌트프리 기간 | Rent Free Period | 렌트프리 기간 |
| `lease.ti` | TI 지원금 | TI Allowance | 인테리어 공사 지원금 |
| `lease.effective_rent` | 실질 임대료 | Effective Rent | 실질 임대료 |

### F. Sales (`sale.*`)

| Content Key | Korean | English | Excel Header |
| :--- | :--- | :--- | :--- |
| `sale.price` | 매매가 | Sale Price | 매매가 |
| `sale.price_unit` | 매매가 (단위) | Sale Price p/Area | - |
| `sale.cap_rate` | 예상 Cap Rate | Est. Cap Rate | 예상 Cap rate |
| `sale.buyer` | 매수자 | Buyer | 매수자 |
| `sale.seller` | 매도자 | Seller | 매도자 |

---

## 3. Implementation Checklist

1.  **Update JSON**: Add missing keys to `i18n/locales/en.json` and `ko.json`.
2.  **Verify UI**: Ensure all columns in Data Grids / Property Details use `$t('key')`.
3.  **Excel Import**: When reading Excel files, map the "Excel Header" to the "Content Key" using a mapping utility.

