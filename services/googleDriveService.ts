import type { DriveFile } from '../types';

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

export async function searchDriveFiles(query: string, accessToken: string): Promise<DriveFile[]> {
    const searchParams = new URLSearchParams({
        q: `name contains '${query}' or fullText contains '${query}'`,
        fields: 'files(id, name, mimeType, webViewLink)',
        pageSize: '10'
    });

    const response = await fetch(`${DRIVE_API_URL}?${searchParams.toString()}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message || 'Failed to search Google Drive');
    }

    const data = await response.json();
    return data.files as DriveFile[];
}
