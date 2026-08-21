# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Search

The site search has two passes. A lexical pass over `src/lib/searchCorpus.js`
returns matches instantly as you type; a second pass sends the query plus a
shortlist of candidate pages to OpenRouter, which writes a one-or-two sentence
answer and re-ranks the matches with a short reason for each.

The OpenRouter key is never in the client bundle. The browser talks to
`POST /api/search`, and only that server-side handler holds the key.

```
src/lib/searchCorpus.js   catalog of every searchable page + lexical scoring
src/lib/aiSearch.js       browser client for /api/search
api/_lib/search-core.js   shared handler: validation, rate limit, OpenRouter call
api/search.js             Vercel / Node adapter
functions/api/search.js   Cloudflare Pages adapter
vite.config.js            serves /api/search during `npm start`
```

### Configuration

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `OPENROUTER_API_KEY` | Required. Server-side only. |
| `OPENROUTER_MODEL` | Defaults to `openai/gpt-5.6-luna`. |
| `SITE_URL` | Sent to OpenRouter for dashboard attribution. |

None of these use a `VITE_` prefix, which is what keeps Vite from inlining them
into the client bundle. Set the same names as secrets on your host — Vercel
under Project Settings > Environment Variables, Cloudflare Pages via
`wrangler pages secret put OPENROUTER_API_KEY`.

If the endpoint is unreachable or unconfigured, search quietly falls back to the
lexical results and shows an inline notice instead of an answer.
