import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

export const uploadProfilePicture = async (file: File): Promise<string> => {
  try {
    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const filename = `profile_pictures/${timestamp}_${file.name}`;
    
    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, filename);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload profile picture');
    throw error;
  }
}; 