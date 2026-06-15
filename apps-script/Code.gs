/**
 * CurioCrate Google Apps Script
 *
 * Deployed as a Web App (Execute as: Me, Access: Anyone).
 * Handles all actions for the website's API calls.
 *
 * Chapters sheet columns:
 *   A = Email | B = President Name | C = School | D = Logo URL | E = State | F = City
 *   G = President Photo URL | H = Vice President | I = Treasurer | J = Secretary | K = Social Media Manager
 */

function doGet(e) {
  const action = e.parameter.action

  if (action === 'get_chapters') {
    return getChapters()
  }

  return json({ ok: true, msg: 'Curio Crate Apps Script running.' })
}

function getChapters() {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName('Chapters')

    if (!sheet) {
      return json({ ok: false, error: 'Chapters sheet not found' })
    }

    const rows = sheet.getDataRange().getValues()
    // Row 0 is the header — skip it
    const chapters = rows.slice(1)
      .filter(r => String(r[2]).trim()) // must have a school name in col C
      .map(r => ({
        email:          String(r[0]  || '').trim(),
        president:      String(r[1]  || '').trim(),
        school:         String(r[2]  || '').trim(),
        logo:           String(r[3]  || '').trim(),
        state:          String(r[4]  || '').trim(),
        city:           String(r[5]  || '').trim(),
        presidentPhoto: String(r[6]  || '').trim(),
        vicePresident:  String(r[7]  || '').trim(),
        treasurer:      String(r[8]  || '').trim(),
        secretary:      String(r[9]  || '').trim(),
        socialMedia:    String(r[10] || '').trim(),
      }))

    return json({ ok: true, chapters })
  } catch (err) {
    return json({ ok: false, error: err.toString() })
  }
}

// Helper — always returns JSON with CORS header
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
