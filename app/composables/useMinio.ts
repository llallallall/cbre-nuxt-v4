// app/composables/useMinio.ts

export const useMinio = () => {
    const toast = useToast();

    const uploadFile = async (file: File, uuid: string) => {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
        const originalKey = `${timestamp}_${uuid}.${ext}`;

        try {
            // 1. Upload Original
            const originalFormData = new FormData();
            originalFormData.append('file', file);
            originalFormData.append('fileKey', originalKey);
            originalFormData.append('uuid', uuid);

            const { data: orgData, error: orgError } = await useFetch('/api/upload/minioFileUploader', {
                method: 'POST',
                body: originalFormData,
            });

            if (orgError.value) throw new Error(orgError.value.statusMessage || 'Upload failed');
            const orgResult = orgData.value as any;

            // 2. Generate Thumbnail (Client-side) if Image
            if (file.type.startsWith('image/')) {
                try {
                    // 💡 Dynamic Import
                    const imageCompression = (await import('browser-image-compression')).default;

                    const options = {
                        maxSizeMB: 0.3,
                        maxWidthOrHeight: 600,
                        useWebWorker: true,
                    };
                    const compressedBlob = await imageCompression(file, options);
                    const thumbFile = new File([compressedBlob], `thumb_${file.name}`, { type: file.type });
                    const thumbKey = `thumb_${originalKey}`;

                    const thumbFormData = new FormData();
                    thumbFormData.append('file', thumbFile);
                    thumbFormData.append('fileKey', thumbKey);
                    thumbFormData.append('uuid', uuid);

                    await useFetch('/api/upload/minioFileUploader', {
                        method: 'POST',
                        body: thumbFormData,
                    });

                } catch (thumbError) {
                    console.warn('Thumbnail generation failed:', thumbError);
                }
            }

            return {
                fileKey: orgResult.fileKey || originalKey,
                fileUrl: orgResult.fileUrl || orgResult.url,
            };

        } catch (e: any) {
            console.error('MinIO Upload Error:', e);
            toast.add({ title: `Failed to upload ${file.name}`, color: 'error', icon: 'i-heroicons-exclamation-circle' });
            return null;
        }
    };

    const deleteFile = async (fileKey: string) => {
        try {
            const { data, error } = await useFetch('/api/upload/minioFileUploader', {
                method: 'DELETE',
                body: { fileKey }
            });

            if (error.value) throw new Error(error.value.statusMessage || 'Delete failed');
            return { status: 'success', result: data.value };
        } catch (e: any) {
            console.error('MinIO Delete Error:', e);
            toast.add({ title: 'Failed to delete file', color: 'error', icon: 'i-heroicons-exclamation-circle' });
            return { status: 'error', result: e.message };
        }
    };

    return {
        uploadFile,
        deleteFile
    };
};
