// services/uploadService.ts - Updated for opportunities
import axios from 'axios';

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Existing functions (keep these)
export async function uploadProfilePicture(file: File, jwtToken: string, accountType: 'student' | 'organization') {
    if (!file) throw new Error("No file selected for upload.");

    // 1. Get signed URL from backend
    const getUrlResponse = await axios.post(
        `${BACKEND_BASE_URL}/get-signed-upload-url/`,
        { file_name: file.name, content_type: file.type },
        { headers: { 'Authorization': `Bearer ${jwtToken}` } }
    );
    const { upload_url, public_download_url } = getUrlResponse.data;

    console.log(getUrlResponse)

    // 2. Upload file to signed URL
    await axios.put(upload_url, file, { headers: { 'Content-Type': file.type } });

    // 3. Update user's profile_pic_url in backend (NESTED under "user")
    const updateEndpoint =
        accountType === 'student'
            ? `${BACKEND_BASE_URL}/student/update/`
            : `${BACKEND_BASE_URL}/organization/update/`;
     console.log(public_download_url)
    try {
        await axios.patch(
            updateEndpoint,
            { user: { profile_pic_url: public_download_url } },
            { headers: { 'Authorization': `Bearer ${jwtToken}` } }
        );
    } catch (error) {
        console.error(error.response?.data || error.message);
    }

    return public_download_url;
}

export async function uploadPostMedia(file: File, jwtToken: string): Promise<string> {
    if (!file) throw new Error("No file selected for upload.");

    // 1. Get signed URL from backend
    const getUrlResponse = await axios.post(
        `${BACKEND_BASE_URL}/get_post_media_upload_url/`,
        { file_name: file.name, content_type: file.type },
        { headers: { 'Authorization': `Bearer ${jwtToken}` } }
    );
    const { upload_url, public_download_url } = getUrlResponse.data;

    // 2. Upload file to signed URL
    await axios.put(upload_url, file, { headers: { 'Content-Type': file.type } });

    // 3. Return the public URL for use in the post
    return public_download_url;
}

// NEW: Upload function specifically for opportunities using get_media_upload_url
export async function uploadOpportunityImage(file: File, jwtToken: string): Promise<string> {
    if (!file) throw new Error("No file selected for upload.");

    console.log('Starting opportunity image upload for file:', file.name, file.type);

    // 1. Get signed URL from backend using the get_media_upload_url endpoint
    const getUrlResponse = await axios.post(
        `${BACKEND_BASE_URL}/get_media_upload_url/`,
        { 
            file_name: `opportunity_${Date.now()}_${file.name}`,
            content_type: file.type 
        },
        { 
            headers: { 
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            } 
        }
    );
    
    const { upload_url, public_download_url } = getUrlResponse.data;
    console.log('Received signed URL:', { upload_url, public_download_url });

    // 2. Upload file to signed URL
    console.log('Uploading file to Firebase Storage...');
    await axios.put(upload_url, file, { 
        headers: { 
            'Content-Type': file.type,
            'Content-Length': file.size.toString()
        } 
    });

    console.log('File uploaded successfully, public URL:', public_download_url);
    return public_download_url;
}

// Utility function to validate image files
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
        return { isValid: false, error: 'Please select an image file (JPEG, PNG, GIF, etc.)' };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { isValid: false, error: 'Image size should be less than 5MB' };
    }

    // Check file extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(fileExtension)) {
        return { isValid: false, error: 'Please select a valid image format (JPEG, PNG, GIF, WebP)' };
    }

    return { isValid: true };
}