# Adding downloadable content

The content on the **download page** is dynamically generated.

This documentation is for developers and advanced users.

## For existing users

If you've previously run the download script:
- Run `npm run downloads` to generate the download content
- Commit the generated JSON files to git

```bash
git add .
git commit -m "Add download content"
git push
```

## For first-time setup

Follow these steps:

1. Clone the Xen Project repository
2. Run `npm install` to install dependencies
3. Create or edit the `.env` file and add your GitHub token:

```
GITHUB_TOKEN=your_github_token
```

To generate a GitHub token:
1. Go to [GitHub Token Settings](https://github.com/settings/tokens)
2. Create a new personal access token
3. Set it to never expire (optional)
4. Select "All public repositories" for scope
5. Click "Generate token"
6. Copy the token to your `.env` file

Finally:
1. Run `npm run downloads` to generate the download content
2. Commit the generated JSON files:

```bash
git add .
git commit -m "Add download content"
git push
```

