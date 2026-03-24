import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db } from './firebase';

export async function checkExistingApplication(email) {
  const q = query(
    collection(db, 'applications'),
    where('emailAddress', '==', email)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { allowed: true };
  }

  const applications = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Check if any application is NOT rejected
  const activeApp = applications.find(app => app.status !== 'rejected');
  if (activeApp) {
    const statusLabel = activeApp.status.charAt(0).toUpperCase() + activeApp.status.slice(1);
    return {
      allowed: false,
      reason: `You already have an active application (Status: ${statusLabel}). Please wait for our decision before applying again.`
    };
  }

  // All are rejected. Check the most recent rejection.
  const rejections = applications.filter(app => app.status === 'rejected');
  const latestRejection = rejections.sort((a, b) => {
    const dateA = a.decisionAt?.toDate?.() || a.updatedAt?.toDate?.() || new Date(0);
    const dateB = b.decisionAt?.toDate?.() || b.updatedAt?.toDate?.() || new Date(0);
    return dateB - dateA;
  })[0];

  if (latestRejection) {
    const decisionDate = latestRejection.decisionAt?.toDate?.() || latestRejection.updatedAt?.toDate?.();
    if (decisionDate) {
      const now = new Date();
      const diffMs = now - decisionDate;
      const weekInMs = 7 * 24 * 60 * 60 * 1000;

      if (diffMs < weekInMs) {
        const remainingMs = weekInMs - diffMs;
        const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
        return {
          allowed: false,
          reason: `Your previous application was recently rejected. You can apply again in ${remainingDays} day${remainingDays > 1 ? 's' : ''}.`
        };
      }
    }
  }

  return { allowed: true };
}

export async function uploadCv(file, applicantName = 'applicant') {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'applications');
  formData.append('resource_type', 'auto');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to upload CV');
  }

  const data = await response.json();

  return {
    cvStoragePath: data.public_id,
    cvDownloadUrl: data.secure_url,
    cvFileName: file.name,
  };
}

export async function uploadProfileImage(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'profiles');
  formData.append('resource_type', 'image');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to upload profile image');
  }

  const data = await response.json();
  return data.secure_url;
}

export async function submitApplication(payload) {
  const docRef = await addDoc(collection(db, 'applications'), {
    firstName: payload.firstName,
    lastName: payload.lastName,
    gender: payload.gender,
    age: Number(payload.age),
    phoneNumber: payload.phoneNumber,
    emailAddress: payload.emailAddress,
    positionApplied: payload.positionApplied,
    country: payload.country,
    currentAddress: payload.currentAddress,
    cvStoragePath: payload.cvStoragePath || null,
    cvDownloadUrl: payload.cvDownloadUrl || null,
    cvFileName: payload.cvFileName || null,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { success: true, applicationId: docRef.id };
}

export async function submitContactMessage(payload) {
  const docRef = await addDoc(collection(db, 'messages'), {
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Send email notification to Admin via EmailJS
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;

    if (serviceId && templateId && publicKey) {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: payload.name,
          reply_to: payload.email,
          subject: payload.subject,
          message: payload.message,
        },
        publicKey
      );
      console.log(`EmailJS: Contact notification sent successfully to admin.`);
    } else {
      console.warn('EmailJS: Missing configuration for contact template.');
    }
  } catch (error) {
    console.error('EmailJS Error: Failed to send direct contact notification.', error);
  }

  return { success: true, messageId: docRef.id };
}

export async function updateApplicationStatus(payload) {
  const { applicationId, status } = payload;
  
  // 1. Update the document status in Firestore
  await updateDoc(doc(db, 'applications', applicationId), {
    status,
    decisionAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2. Fetch the application details so we know who to email
  try {
    const appDoc = await getDoc(doc(db, 'applications', applicationId));
    if (appDoc.exists()) {
      const applicantData = appDoc.data();
      
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      let templateId;
      if (status === 'accepted') {
        templateId = import.meta.env.VITE_EMAILJS_ACCEPTED_TEMPLATE_ID;
      } else if (status === 'rejected') {
        templateId = import.meta.env.VITE_EMAILJS_REJECTED_TEMPLATE_ID;
      }

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            name: applicantData.firstName,
            emailAddress: applicantData.emailAddress,
            positionApplied: applicantData.positionApplied,
          },
          publicKey
        );
        console.log(`EmailJS: Successfully sent ${status} email to ${applicantData.emailAddress}`);
      } else {
        console.warn('EmailJS environment variables for Accepted/Rejected templates are missing.');
      }
    }
  } catch (error) {
    console.error('Error sending decision email via EmailJS. Details:', error);
  }

  return { success: true, applicationId, status };
}
