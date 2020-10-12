# github-publish-release

[![Codeship Status for ahmdigital/github-publish-release](https://app.codeship.com/projects/fa578ea0-0226-0138-345f-6ebc63c4dece/status?branch=master)](https://app.codeship.com/projects/378227)

*NOTE:* This repo is manually released for now.

Tools aimed to simplify release publishing on github. It gets latest release available and builds a list of pull
requests that were merged thereafter. As a result you get a nicely looking release notes:

-----

- initial version #1 (by @runk)
- fix path, update readme #2 (by @runk)

-----

## Configuration

To use this tool you need to generate personal access token with `repo` access (see
[help article](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) for details), then
configure environment variable `GITHUB_OAUTH_TOKEN` with this token. That's it.
*NOTE:* Github's token UI is misleading, the `repo` checkbox is different to ticking all the nested checkboxes; theres extra permissions you can't grant granularly.

## Expected release flow

1. Make a commit with message including **[major]**, **[minor]** or **[patch]**. `git commit -a -m '[major]: Do some breaking changes'`
2. Run `github-publish-release` script.
3. Push local changes (that occur in p. 1) to github with `git push --follow-tags` or similar.
4. Publish module with `npm publish`.
