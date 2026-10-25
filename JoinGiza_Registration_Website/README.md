# Join Giza registration page: setup

Three files:

- `index.html` is the registration page. It is self-contained (logo and lettering built in) and works on phones and desktops. Double-click it to preview it in your browser. It shows **PREVIEW MODE** until step 1 is done.
- `Code.gs` is the script that writes each sign-up into a Google Sheet and saves attached CVs to Google Drive.
- `README.md` is this guide.

Use a company Google account (HR or careers), not a personal one. That account owns the sheet and the CV folder.

## 1. Connect the Google Sheet (about 5 minutes)

1. Go to **sheets.new** and name the sheet `Join Giza registrations`.
2. Open **Extensions → Apps Script**. Delete the sample code, paste in all of `Code.gs`, and click **Save**.
3. In the function menu at the top, choose `setup` and click **Run**. Google will ask for permission. Click **Review permissions**, choose the account, then **Advanced → Go to project (unsafe)** and **Allow**. This happens once. It creates the **Registrations** tab and a **Join Giza CVs** folder in Drive.
4. Click **Deploy → New deployment**. Click the gear icon, choose **Web app**, then set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.
6. Open `index.html` in Notepad. Find `PASTE_YOUR_WEB_APP_URL_HERE`, replace it with the URL, and save.

Optional: to get an email for each sign-up, put an address in `NOTIFY_TO` at the top of `Code.gs`.

If you change `Code.gs` later, go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

## 2. Host the page for free on GitHub Pages

1. Create a free account at **github.com**. The username becomes part of the link, so pick something like `gizaspin-careers`.
2. Click **New repository**, name it `join-giza`, set it to **Public**, and click **Create**.
3. Click **Add file → Upload files**, drag in `index.html`, and click **Commit changes**.
4. Go to **Settings → Pages**. Under **Source**, choose **Deploy from a branch**, then **main** and **/ (root)**, and click **Save**.
5. After about a minute, the page is live at `https://USERNAME.github.io/join-giza/`.

Other free options:

- **Netlify Drop** (app.netlify.com/drop): drag the folder in, then rename the site.
- **Cloudflare Pages**: works the same way.

If IT can add one DNS record, a custom address such as `careers.gizaspin.com` can point at the GitHub page.

## What the page asks for

- **About you:** full name, email, mobile.
- **Your studies:** university (pre-filled with AUC), major (AUC's 36 undergraduate majors, plus **Other** with a text box), graduation year.
- **What you're looking for:** internship, graduate / entry-level role, or experienced role (mid-level / senior), plus the **Fields** they'd like to work in (20 options plus **Other** with a text box).
- **Optional:** LinkedIn link, CV as a PDF up to 5 MB.
- **Consent tick box.**

Each sign-up becomes one row in the sheet, with these columns: ID, Timestamp, Full name, Email, Mobile, University, Major, Graduation year, Interested in, Fields, LinkedIn, CV (Drive link), Source, Consent.

## 3. Test it

Open the link on a phone and submit a test registration. A new row should appear in the sheet, numbered `JG-0001`, `JG-0002` and so on.

Until the URL is pasted in, the page shows **PREVIEW MODE** and saves nothing.

## 4. QR code

The brochure QR points to the page link with `?src=brochure` on the end. The sheet's **Source** column then shows which sign-ups came from the brochure.

For other places, use other tags: `?src=booth` for the booth screen, `?src=instagram` for social posts.

## Privacy

The sheet holds students' personal details. Share it only with HR. Delete the test rows before the fair.
