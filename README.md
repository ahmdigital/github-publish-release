# github-publish-release

Tools aimed to simplify release publishing on github. It gets latest release available and builds a list of pull 
requests that were merged thereafter. As a result you get a nicely looking release notes:

-----

 - Implement initial version #1 (by @runk)
 - Fix path #2 (by @runk)

-----


#### Configuration

In order to use this tool you need to generate personal access token with repository access (see 
[help article](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) for details), then
configure environment variable `GITHUB_OAUTH_TOKEN` with this token. That's it.

#### Expected release flow

1. Bump version in `package.json`, either manually or via `npm version minor` etc.
2. Run `github-publish-release` script.
3. Push local changes (that occur in p. 1) to github with `git push --follow-tags` or similar.
4. Publish module with `npm publish`.
