# Content to replace

The pages are filled with demo data. Each demo item is marked in the HTML with `<!-- DEMO -->`. Search for it. Nothing below should go live unchecked.

## Facts taken from his documents (confirm them)

From `REPORT ON SIGNIFICANT ACHIEVEMENTS AT INSTITUTIONS` and the CV. These are not demo data, but need his approval.

- Name, title "Tourism economist", Ph.D. in Tourism Economical Science (1993), "32+ years".
- The four expertise areas, six projects, and the roles and tags in the Experience list (organizations, programmes and plan names).
- The six principles on the About page (from the report's closing paragraph).
- The 2002 UNDP workshop photo and its project card (the banner in the photo confirms it).

## Demo data to replace

| Where | Demo item |
|---|---|
| Hero | "Open to consulting work" |
| Home, About | Second stat "40+ reports, papers and plans" |
| Home, About | Every period in the Experience, Education and Recognition lists (for example "2003 to 2005") |
| About | Master's degree (subject and year), "Nepal Tourism Professionals Association", the three awards and their bodies, the testimonial and the person quoted |
| Work | The year for each project and the one-sentence scope that follows each description |
| Work | Four rows under "Reports and papers" (titles come from his work, years and types are demo) |
| Home, Writing, Article | All six article titles, topics, dates, summaries, and the full article body, author pager and read time |
| Header, footer, Contact | `hello@example.com`, `+977 1 555 0142`, Kathmandu |
| Contact | LinkedIn link goes to linkedin.com, not a profile |
| Every page | `https://www.example.com` in canonical, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt` |
| JSON-LD | `sameAs`, `alumniOf` ("University in Sofia, Bulgaria") |

## Assumptions

- Visitors: government and donor institutions, tourism business owners, students and researchers, journalists. Main action on every page: "Send an inquiry".
- Voice: first person, short sentences.
- Field: tourism economics and consulting in Nepal (from the documents, not the brief).
- Navigation: About, Work, Writing, Contact. "Writing" is a new page that is not in his documents.
- Hero wording: "Namaste, welcome" and "I am Dr. Gyanendra Tuladhar, Tourism economist" are my wording.

## Photos

- Only the UNDP workshop photo is matched to its project. The other project and article cards use photos chosen for how they look. Match each to a real photo or replace it.
- The portrait source is 600 x 600 px. The cut-out is scaled up, so it looks soft above about 450 px wide. Ask for a larger original.
- Some photos carry orange date stamps (2013). Crop or retouch if needed.
- Group photos show other people. Confirm they agree to appear online.
- 29 photos were supplied. 13 are used on the site.
- `assets/images/og-image.jpg` is a generated share card. Replace it with a designed one.
- Favicons are a "GT" monogram drawn for this site.

## Not included on purpose

- The CV: it contains a birth date, a home address, phone numbers and referees. Publish only a redacted copy.
- The text of `Tourism Consultancy in Nepal.docx`: it still holds drafting notes and mixes "we" with "I".

## Technical

- The contact form has no backend. Set `data-endpoint` in `contact.html`. The `mailto:` action is a no-JavaScript fallback.
- The `<!-- WP: dynamic -->` markers use the exact label requested. They are the only place that word appears.

## Added in October 2026 (from the CV, report and consultancy document)

- Services page (`services.html`): written in first person from `Tourism Consultancy in Nepal.docx`. Confirm the wording.
- About: full education, thesis, languages, awards, affiliations, teaching and curriculum, from the CV. The award "Mahendra Vidya Bhushan" is spelled "Vhushan" in the CV.
- Work: all 46 assignments, 6 industry roles and 27 papers and workshops. Categories on the filter buttons are my grouping.
- Writing: 45 publications. `article.html` (Reimagining Tourism for a New Nepal) and `thesis.html` are rewritten from the CV annexes. The party-addressed proposal in the CV was not published.
- Still private and not published: birth date, home address, phone numbers, personal email, referees.
- Contact form: without a form service it opens the visitor's email app. Replace `hello@example.com` in `contact.html`, or set `data-endpoint`.
