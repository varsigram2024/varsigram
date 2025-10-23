// utils/fileUpload.ts
import axios from 'axios';

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use env variable

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

    // Construct the public URL
    // const filePath = public_download_url;
    // const publicUrl = `https://firebasestorage.googleapis.com/v0/b/versigram-pd.firebasestorage.app/o/${encodeURIComponent(filePath)}?alt=media`;

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
        { 
            file_name: file.name, 
            content_type: file.type 
        },
        { headers: { 'Authorization': `Bearer ${jwtToken}` } }
    );
    const { upload_url, public_download_url } = getUrlResponse.data;

    // 2. Upload file to signed URL
    await axios.put(upload_url, file, { 
        headers: { 
            'Content-Type': file.type,
            // Add this for video uploads to work properly
            'Content-Length': file.size.toString()
        } 
    });

    // 3. Return the public URL for use in the post
    return public_download_url;
}

// You can also create a dedicated function for video uploads if needed
export async function uploadVideo(file: File, jwtToken: string): Promise<string> {
    // Validate file type
    const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
    if (!videoTypes.includes(file.type)) {
        throw new Error("Invalid video format. Supported formats: MP4, MOV, AVI, WEBM");
    }

    // Validate file size (e.g., 50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
        throw new Error("Video file too large. Maximum size is 50MB");
    }

    return uploadPostMedia(file, jwtToken);
}