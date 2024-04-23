export const sendFileToServer = async (file?: File, progressCallback?: (progress: number) => void) => {
    try {
        if (file) {
            const fd = new FormData()
            fd.append('imageData', file)
            fd.append('fileType', file.type);
            console.log(file);
            return new Promise<{ success: boolean, url?: string, mediaType?: string }>((resolve, _) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${import.meta.env.VITE_REACT_APP_ASSETS_SERVER}`);
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        if (progressCallback) {
                            progressCallback(progress);
                        }
                    }
                });
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        const { success, url, mediaType }: { success: boolean, url: string, mediaType: string } = response;
                        resolve({ success, url, mediaType });
                    } else {
                        resolve({ success: false });
                    }
                };
                xhr.onerror = () => {
                    resolve({ success: false });
                };
                xhr.send(fd);
            });
        }
        return { success: false };
    } catch (error) {
        return { success: false };
    }
};
