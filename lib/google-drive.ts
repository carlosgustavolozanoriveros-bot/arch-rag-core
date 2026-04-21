import { google } from 'googleapis';

/**
 * Google Drive API — Permission management for AEC resource access control
 * 
 * Uses a Service Account to share/revoke files and folders with buyer emails.
 * All Drive accounts must share their resource folders with the service account as Editor.
 */

function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Get root folder IDs from environment variable
 */
function getRootFolderIds(): string[] {
  const folders = process.env.GOOGLE_DRIVE_ROOT_FOLDERS || '';
  return folders.split(',').map(id => id.trim()).filter(Boolean);
}

/**
 * Share a specific file with a user's email (for individual purchases)
 */
export async function shareFileWithEmail(fileId: string, email: string): Promise<void> {
  const drive = getDriveClient();

  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        type: 'user',
        role: 'reader',
        emailAddress: email,
      },
      sendNotificationEmail: false,
    });
    console.log(`✅ Shared file ${fileId} with ${email}`);
  } catch (error: any) {
    // If already shared, ignore the error
    if (error?.code === 400 && error?.message?.includes('already has access')) {
      console.log(`ℹ️ File ${fileId} already shared with ${email}`);
      return;
    }
    console.error(`❌ Error sharing file ${fileId} with ${email}:`, error);
    throw error;
  }
}

/**
 * Share ALL root folders with a user's email (for PRO subscriptions)
 */
export async function shareAllFoldersWithEmail(email: string): Promise<void> {
  const drive = getDriveClient();
  const folderIds = getRootFolderIds();

  if (folderIds.length === 0) {
    throw new Error('No GOOGLE_DRIVE_ROOT_FOLDERS configured');
  }

  const results = await Promise.allSettled(
    folderIds.map(async (folderId) => {
      try {
        await drive.permissions.create({
          fileId: folderId,
          requestBody: {
            type: 'user',
            role: 'reader',
            emailAddress: email,
          },
          sendNotificationEmail: false,
        });
        console.log(`✅ Shared folder ${folderId} with ${email}`);
      } catch (error: any) {
        if (error?.code === 400 && error?.message?.includes('already has access')) {
          console.log(`ℹ️ Folder ${folderId} already shared with ${email}`);
          return;
        }
        throw error;
      }
    })
  );

  const failures = results.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(`❌ Failed to share ${failures.length}/${folderIds.length} folders`);
    throw new Error(`Failed to share some folders with ${email}`);
  }
}

/**
 * Revoke access to a specific file (when needed)
 */
export async function revokeFileAccess(fileId: string, email: string): Promise<void> {
  const drive = getDriveClient();

  try {
    // First, find the permission ID for this email
    const res = await drive.permissions.list({
      fileId,
      fields: 'permissions(id, emailAddress)',
    });

    const permission = res.data.permissions?.find(
      p => p.emailAddress?.toLowerCase() === email.toLowerCase()
    );

    if (!permission?.id) {
      console.log(`ℹ️ No permission found for ${email} on file ${fileId}`);
      return;
    }

    await drive.permissions.delete({
      fileId,
      permissionId: permission.id,
    });
    console.log(`✅ Revoked access to file ${fileId} for ${email}`);
  } catch (error) {
    console.error(`❌ Error revoking file access:`, error);
    throw error;
  }
}

/**
 * Revoke access to ALL root folders (for subscription expiration/cancellation)
 */
export async function revokeAllFoldersAccess(email: string): Promise<void> {
  const drive = getDriveClient();
  const folderIds = getRootFolderIds();

  const results = await Promise.allSettled(
    folderIds.map(async (folderId) => {
      try {
        const res = await drive.permissions.list({
          fileId: folderId,
          fields: 'permissions(id, emailAddress)',
        });

        const permission = res.data.permissions?.find(
          p => p.emailAddress?.toLowerCase() === email.toLowerCase()
        );

        if (!permission?.id) {
          console.log(`ℹ️ No permission for ${email} on folder ${folderId}`);
          return;
        }

        await drive.permissions.delete({
          fileId: folderId,
          permissionId: permission.id,
        });
        console.log(`✅ Revoked folder ${folderId} for ${email}`);
      } catch (error) {
        console.error(`❌ Error revoking folder ${folderId}:`, error);
        throw error;
      }
    })
  );

  const failures = results.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(`⚠️ Failed to revoke ${failures.length}/${folderIds.length} folders`);
  }
}

/**
 * Extract Google Drive file ID from a download URL
 */
export function getFileIdFromUrl(url: string): string | null {
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}
