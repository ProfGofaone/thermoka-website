# Thermoka Green Energy — website

The official website of **Thermoka Green Energy (Pty) Ltd**, home of the Thermoka Solar-Thermal Absorption Clinic Cooler.

It is a plain HTML/CSS site with no build step, so it can be hosted for free on GitHub Pages.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `thermoka.html` | The Thermoka Cooler: how it works, features, design targets, roadmap |
| `about.html` | About the company, support and milestones |
| `contact.html` | Contact |
| `404.html` | "Page not found" |

Shared styles are in `assets/css/style.css`, and the logo files are in `assets/img/`.

## Editing text

Open the page's `.html` file on GitHub, click the pencil icon, change the words between the tags, and commit. The live site updates about a minute later.

The header and footer are repeated on every page. If you change them, change them on every page.

## Publishing with GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then choose the `main` branch and the `/ (root)` folder.
3. Click **Save**. After a minute or two the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Connecting a .co.za domain

1. Buy the domain (for example `thermoka.co.za`) from a South African registrar.
2. At the registrar, add these DNS records:
   - Four **A** records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`
   - One **CNAME** record for `www` pointing to `<your-username>.github.io`
3. In **Settings → Pages → Custom domain**, enter the domain and save. Once the certificate is ready, tick **Enforce HTTPS**.
