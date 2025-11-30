import type {
    FloorPlanFileType,
    PropertyImageFileType,
    PropertyBrochureFileType
} from '../../app/types/property.type';

// =======================================================
// 1. 공통 필드 매퍼 (Client camelCase -> DB camelCase for Drizzle)
// =======================================================

/**
 * 파일의 공통 메타데이터를 Drizzle Input 포맷으로 변환합니다.
 */
const mapBaseFileToDrizzle = (file: any) => ({
    fileUuid: file.fileUuid,
    fileName: file.fileName,
    fileKey: file.fileKey,
    fileUrl: file.fileUrl,
    fileContentType: file.fileContentType,
});

// =======================================================
// 2. 개별 파일 타입 매퍼 (Client -> DB)
// =======================================================

/**
 * 🖼️ Image File 매퍼
 */
export const mapImageToDrizzle = (file: PropertyImageFileType, propertyId: string) => ({
    propertyId: propertyId,
    ...mapBaseFileToDrizzle(file),
    main: file.main ?? false,
});

/**
 * 📄 Brochure File 매퍼
 */
export const mapBrochureToDrizzle = (file: PropertyBrochureFileType, propertyId: string) => ({
    propertyId: propertyId,
    ...mapBaseFileToDrizzle(file),
});

/**
 * 🗺️ Floor Plan File 매퍼
 */
export const mapFloorPlanToDrizzle = (file: FloorPlanFileType, propertyId: string) => {
    return {
        propertyId: propertyId,
        ...mapBaseFileToDrizzle(file),
        type: file.type,
        floor: file.floor ?? null,
    };
};


// =======================================================
// 3. 리스트 매퍼 (Client Array -> DB CreateManyInput Array)
// =======================================================

export const mapImageListToDrizzle = (files: any[], propertyId: string) => {
    return files.map(f => mapImageToDrizzle(f, propertyId));
};

export const mapBrochureListToDrizzle = (files: any[], propertyId: string) => {
    return files.map(f => mapBrochureToDrizzle(f, propertyId));
};

export const mapFloorPlanListToDrizzle = (files: any[], propertyId: string) => {
    return files.map(f => mapFloorPlanToDrizzle(f, propertyId));
};
