/**
 * Join Heritage · registration → Google Sheet
 * Paste this into Extensions → Apps Script of the Google Sheet that should
 * receive the registrations, then Deploy → New deployment → Web app
 * (Execute as: Me · Who has access: Anyone). Copy the /exec URL into
 * index.html (const ENDPOINT = "...").
 */

const SHEET_NAME = 'Registrations';
const CV_FOLDER  = 'Join Giza CVs';       // created in your Google Drive on first CV upload
const NOTIFY_TO  = '';                     // optional: an email address to notify on each sign-up

const HEADERS = ['ID', 'Timestamp', 'Full name', 'Email', 'Mobile', 'University', 'Major',
                 'Graduation year', 'Interested in', 'Fields', 'LinkedIn', 'CV', 'Source', 'Consent'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents || '{}');

    if (d.company) return out({ ok: true, id: 'JG-0000' });             // honeypot: silently ignore bots
    if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '') || d.consent !== 'Yes') {
      return out({ ok: false, error: 'missing fields' });
    }

    const sh = sheet_();
    const n  = sh.getLastRow();                                          // header is row 1
    const id = 'JG-' + String(n).padStart(4, '0');

    let cvUrl = '';
    if (d.cvData) {
      const bytes = Utilities.base64Decode(d.cvData);
      if (bytes.length <= 5 * 1024 * 1024) {
        const blob = Utilities.newBlob(bytes, 'application/pdf', id + ' - ' + clean_(d.name) + '.pdf');
        cvUrl = folder_().createFile(blob).getUrl();
      }
    }

    sh.appendRow([id, new Date(), clean_(d.name), clean_(d.email), "'" + String(d.phone || '').slice(0, 40).trim(), clean_(d.university),
                  clean_(d.major), clean_(d.gradYear), clean_(d.interest), clean_(d.fields),
                  clean_(d.linkedin), cvUrl, clean_(d.source), 'Yes']);

    if (NOTIFY_TO) {
      MailApp.sendEmail(NOTIFY_TO, 'New #JOIN_GIZA registration: ' + d.name,
        [id, d.name, d.email, d.phone, d.major, d.gradYear, d.interest].join('\n'));
    }
    return out({ ok: true, id: id });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, service: 'join-giza-registration' }); }

/* ---------- helpers ---------- */
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#1C1715').setFontColor('#FFF4E2');
  }
  return sh;
}
function folder_() {
  const it = DriveApp.getFoldersByName(CV_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(CV_FOLDER);
}
function clean_(v) {                       // stop values being read as spreadsheet formulas
  v = String(v == null ? '' : v).slice(0, 500).trim();
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create the sheet header and grant permissions. */
function setup() { sheet_(); folder_(); }
