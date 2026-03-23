import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const GMAIL_USER = defineSecret('GMAIL_USER');
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');
const ADMIN_EMAILS = defineSecret('ADMIN_EMAILS');

const POSITION_OPTIONS = new Set([
  'Intern (Applicable to PH only)',
  'HR/Admin Assistant',
  'Admin Accounting',
  'Marketing & Sales Executive',
  'Data Curation (Genealogy Project)',
  'AI Video Creator/Editor',
]);

const GENDER_OPTIONS = new Set([
  'male',
  'female',
  'non_binary',
  'prefer_not_to_say',
  'other',
]);

function getAdminEmailSet() {
  return new Set(
    (ADMIN_EMAILS.value() || '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );
}

function requireString(value, fieldName, maxLen = 200) {
  if (typeof value !== 'string') {
    throw new HttpsError('invalid-argument', `${fieldName} must be a string.`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new HttpsError('invalid-argument', `${fieldName} is required.`);
  }
  if (trimmed.length > maxLen) {
    throw new HttpsError('invalid-argument', `${fieldName} is too long.`);
  }

  return trimmed;
}

function requireEmail(value, fieldName = 'email') {
  const email = requireString(value, fieldName, 320);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new HttpsError('invalid-argument', `${fieldName} is invalid.`);
  }
  return email.toLowerCase();
}

function assertAdmin(requestAuth) {
  if (!requestAuth) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }

  const token = requestAuth.token || {};
  const authEmail = String(token.email || '').toLowerCase();
  const adminByClaim = Boolean(token.admin);
  const adminByEmail = getAdminEmailSet().has(authEmail);

  if (!adminByClaim && !adminByEmail) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }
}

function getMailer() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER.value(),
      pass: GMAIL_APP_PASSWORD.value(),
    },
  });
}

function toClientDoc(docSnap) {
  const data = docSnap.data() || {};
  const output = { id: docSnap.id };

  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value.toDate === 'function') {
      output[key] = value.toDate().toISOString();
    } else {
      output[key] = value;
    }
  }

  return output;
}

export const submitApplication = onCall({ region: 'us-central1' }, async (request) => {
  const data = request.data || {};

  const firstName = requireString(data.firstName, 'firstName', 80);
  const lastName = requireString(data.lastName, 'lastName', 80);
  const gender = requireString(data.gender, 'gender', 30);
  const phoneNumber = requireString(data.phoneNumber, 'phoneNumber', 40);
  const emailAddress = requireEmail(data.emailAddress, 'emailAddress');
  const positionApplied = requireString(data.positionApplied, 'positionApplied', 120);
  const country = requireString(data.country, 'country', 80);
  const currentAddress = requireString(data.currentAddress, 'currentAddress', 400);
  const cvStoragePath = requireString(data.cvStoragePath, 'cvStoragePath', 500);
  const cvDownloadUrl = requireString(data.cvDownloadUrl, 'cvDownloadUrl', 2000);
  const cvFileName = requireString(data.cvFileName, 'cvFileName', 300);

  const ageValue = Number(data.age);
  if (!Number.isInteger(ageValue) || ageValue < 16 || ageValue > 80) {
    throw new HttpsError('invalid-argument', 'age must be a number between 16 and 80.');
  }
  if (!GENDER_OPTIONS.has(gender)) {
    throw new HttpsError('invalid-argument', 'gender is invalid.');
  }
  if (!POSITION_OPTIONS.has(positionApplied)) {
    throw new HttpsError('invalid-argument', 'positionApplied is invalid.');
  }

  const applicationData = {
    firstName,
    lastName,
    gender,
    age: ageValue,
    phoneNumber,
    emailAddress,
    positionApplied,
    country,
    currentAddress,
    cvStoragePath,
    cvDownloadUrl,
    cvFileName,
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    decisionAt: null,
    decisionBy: null,
    decisionReason: null,
    decisionEmailSent: false,
    decisionEmailSentAt: null,
    decisionEmailError: null,
  };

  const docRef = await db.collection('applications').add(applicationData);
  return { success: true, applicationId: docRef.id };
});

export const onApplicationCreated = onDocumentCreated(
  { document: 'applications/{appId}', region: 'us-central1', secrets: [GMAIL_USER, GMAIL_APP_PASSWORD] },
  async (event) => {
    const snap = event.data;
    if (!snap) {
      return;
    }
    const data = snap.data();

    const baseUrl = 'https://lifewood.com';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px;">
        <img src="${baseUrl}/logo.png" alt="Lifewood" style="max-height: 30px; margin-bottom: 24px;" />
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin-bottom: 24px;" />
        
        <p style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">Thank you, ${data.firstName}.</p>
        
        <p style="margin-bottom: 16px; line-height: 1.6;">We have received your application for <strong>${data.positionApplied}</strong> at Lifewood.</p>
        
        <p style="margin-bottom: 16px; line-height: 1.6;">Your application has been submitted successfully. Our team will review it, and an administrator will contact you if your profile matches the next stage of the process.</p>
        
        <p style="margin-bottom: 24px; line-height: 1.6;">We appreciate your interest in joining our team.</p>
        
        <a href="${baseUrl}" style="display: inline-block; background-color: #f7a944; color: #111; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-bottom: 32px;">Visit Lifewood</a>
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin-bottom: 24px;" />
        
        <p style="margin-bottom: 4px; color: #153f2c;">Best regards,</p>
        <p style="margin-top: 0; color: #153f2c;">The Lifewood Team</p>
      </div>
    `;

    try {
      const mailer = getMailer();
      await mailer.sendMail({
        from: `"Lifewood Careers" <${GMAIL_USER.value()}>`,
        to: data.emailAddress,
        subject: `Application Received - ${data.positionApplied}`,
        html: emailHtml,
      });
      logger.info('Confirmation email sent to', data.emailAddress);
    } catch (error) {
      logger.error('Failed to send application confirmation email.', error);
    }
  }
);

export const submitContactMessage = onCall(
  { region: 'us-central1', secrets: [GMAIL_USER, GMAIL_APP_PASSWORD] },
  async (request) => {
    const data = request.data || {};

    const name = requireString(data.name, 'name', 120);
    const email = requireEmail(data.email, 'email');
    const subject = requireString(data.subject, 'subject', 200);
    const message = requireString(data.message, 'message', 5000);

    const messageData = {
      name,
      email,
      subject,
      message,
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('messages').add(messageData);

    try {
      const mailer = getMailer();
      await mailer.sendMail({
        from: `"Lifewood Website" <${GMAIL_USER.value()}>`,
        to: GMAIL_USER.value(),
        subject: `New Contact Message: ${subject}`,
        text:
          `You received a new contact message.\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Subject: ${subject}\n\n` +
          `Message:\n${message}\n`,
      });
    } catch (error) {
      logger.error('Failed to send contact notification email.', error);
    }

    return { success: true, messageId: docRef.id };
  }
);

export const getAdminDashboardData = onCall(
  { region: 'us-central1', secrets: [ADMIN_EMAILS] },
  async (request) => {
    assertAdmin(request.auth);

    const [applicationsSnap, messagesSnap] = await Promise.all([
      db.collection('applications').orderBy('createdAt', 'desc').limit(200).get(),
      db.collection('messages').orderBy('createdAt', 'desc').limit(200).get(),
    ]);

    return {
      applications: applicationsSnap.docs.map(toClientDoc),
      messages: messagesSnap.docs.map(toClientDoc),
    };
  }
);

export const updateApplicationStatus = onCall(
  { region: 'us-central1', secrets: [GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAILS] },
  async (request) => {
    assertAdmin(request.auth);

    const data = request.data || {};
    const applicationId = requireString(data.applicationId, 'applicationId', 120);
    const status = requireString(data.status, 'status', 40).toLowerCase();
    const decisionReasonRaw = typeof data.decisionReason === 'string' ? data.decisionReason.trim() : '';

    if (!['accepted', 'rejected'].includes(status)) {
      throw new HttpsError('invalid-argument', 'status must be accepted or rejected.');
    }

    const appRef = db.collection('applications').doc(applicationId);
    const appSnap = await appRef.get();
    if (!appSnap.exists) {
      throw new HttpsError('not-found', 'Application not found.');
    }

    const appData = appSnap.data();
    const applicantEmail = requireEmail(appData.emailAddress, 'applicantEmail');
    const applicantName = `${appData.firstName || ''} ${appData.lastName || ''}`.trim() || 'Applicant';
    const positionApplied = appData.positionApplied || 'the selected role';
    const adminEmail = String(request.auth?.token?.email || 'admin');

    const updatePayload = {
      status,
      decisionAt: admin.firestore.FieldValue.serverTimestamp(),
      decisionBy: adminEmail,
      decisionReason: decisionReasonRaw || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      decisionEmailSent: false,
      decisionEmailSentAt: null,
      decisionEmailError: null,
    };

    await appRef.update(updatePayload);

    try {
      const mailer = getMailer();
      const subject =
        status === 'accepted'
          ? 'Your Lifewood Application Update'
          : 'Update on Your Lifewood Application';
      const decisionLine =
        status === 'accepted'
          ? 'We are pleased to let you know that your application has been accepted.'
          : 'Thank you for your interest. At this time, we are unable to move forward with your application.';

      await mailer.sendMail({
        from: `"Lifewood Careers" <${GMAIL_USER.value()}>`,
        to: applicantEmail,
        subject,
        text:
          `Hello ${applicantName},\n\n` +
          `${decisionLine}\n` +
          `Position: ${positionApplied}\n\n` +
          `${decisionReasonRaw ? `Additional note: ${decisionReasonRaw}\n\n` : ''}` +
          `Regards,\nLifewood Team`,
      });

      await appRef.update({
        decisionEmailSent: true,
        decisionEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        decisionEmailError: null,
      });
    } catch (error) {
      logger.error('Failed to send decision email.', error);
      await appRef.update({
        decisionEmailSent: false,
        decisionEmailError: error?.message || 'Unknown email error',
      });
      throw new HttpsError(
        'internal',
        'Status updated, but email delivery failed. Please verify Gmail configuration.'
      );
    }

    return { success: true, applicationId, status };
  }
);
