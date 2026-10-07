# Micah Leigh Painting

Static HTML/CSS/JS site. No framework; open `index.html` or serve the folder.

## Pages

| Page | File | Status |
| --- | --- | --- |
| Home | `index.html` | Built |
| About Us | `about-us.html` | Placeholder (title only, `noindex`) |
| Services | `services.html` | Placeholder |
| Free Quote | `free-quote.html` | Placeholder |
| Contact Us | `contact-us.html` | Placeholder |

## Shared header and footer

The header and footer live in `tools/partials/` and are stamped into every page between the
`<!--@header-->` and `<!--@footer-->` markers. After editing a partial, run:

```bash
npm run build
```

The build also marks the current page in the nav and creates any missing placeholder page.
When you build out a placeholder page, edit it freely (the build never overwrites page content),
and remove its `noindex` tag.

## Quote form

The form on the homepage has an empty `data-endpoint`. Until it points at a form service
(Formspree, Netlify Forms, etc.) it shows a message asking the visitor to call instead.
Set `data-endpoint="https://..."` on `<form data-quote-form>` to go live.

## Design notes

- Headlines: Archivo, variable width axis set condensed + italic to echo the slanted logo lettering.
- Body: Instrument Sans.
- Colors come from the logo (blue, navy). Yellow ("painter's tape") is used only for calls to action.
- Photos and copy come from the previous site (micahleighpainting.com). The paint-chip color names
  on photos are descriptive and should be confirmed with the client.
