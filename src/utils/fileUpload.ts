import axios from 'axios';

const BACKEND_BASE_URL = 'https://api.varsigram.com';

export async function uploadProfilePicture(file: File, jwtToken: string, accountType: 'student' | 'organization') {
    if (!file) throw new Error("No file selected for upload.");

    // 1. Get signed URL from backend
    const getUrlResponse = await axios.post(
        `${BACKEND_BASE_URL}/api/v1/get-signed-upload-url/`,
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
            ? `${BACKEND_BASE_URL}/api/v1/student/update/`
            : `${BACKEND_BASE_URL}/api/v1/organization/update/`;
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
        `${BACKEND_BASE_URL}/api/v1/get_post_media_upload_url/`,
        { file_name: file.name, content_type: file.type },
        { headers: { 'Authorization': `Bearer ${jwtToken}` } }
    );
    const { upload_url, public_download_url } = getUrlResponse.data;

    // 2. Upload file to signed URL
    await axios.put(upload_url, file, { headers: { 'Content-Type': file.type } });

    // 3. Return the public URL for use in the post
    return public_download_url;
} 