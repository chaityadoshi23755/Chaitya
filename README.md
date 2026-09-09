# Chaitya Doshi — Portfolio

A static, multi-page portfolio site: full-stack & cloud engineering work, projects, published research, and contact — built for both job applications and freelance clients.

## Structure

```
index.html        Home
experience.html    Work history (internship + freelance)
projects.html      Independent projects
about.html          Background, skills, publications
contact.html       Contact
css/styles.css      All styling
js/script.js        Mobile nav + footer year
assets/resume/       Downloadable résumé
```

No build step — plain HTML/CSS/JS.

## Preview locally

From this folder:

```
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the `main` branch and `/ (root)` folder, then **Save**.
5. The site publishes at `https://<username>.github.io/<repo-name>/`.
