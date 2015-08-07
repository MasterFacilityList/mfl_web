import os
import json
import logging

from github3 import login


logging.basicConfig(level=logging.DEBUG)


def main(access_token, repo_owner, repo_name, tag, branch_name, release_asset, release_asset_type, prerelease=True, deploy_env='staging'):  # noqa
    gh = login(token=access_token)
    repo = gh.repository(repo_owner, repo_name)

    # create release
    release_asset_name = "{}__{}.tar.gz".format(release_asset.name, tag)
    release = repo.create_release(tag, branch_name, prerelease=prerelease)
    release.upload_asset(release_asset_type, release_asset_name, release_asset)

    # create deployment
    repo.create_deployment(
        branch_name, force=False, payload=json.dumps({"version": tag}),
        auto_merge=False, environment=deploy_env
    )


if __name__ == '__main__':
    with open(os.getenv('RELEASE_ASSET'), 'rb') as asset, open(os.getenv('PACKAGE_JSON'), 'rt') as pkg_json:  # noqa
        version = json.load(pkg_json)['version']
        main(
            access_token=os.getenv('GH_TOKEN'),
            repo_owner='masterfacilitylist',
            repo_name=os.getenv('CIRCLE_PROJECT_REPONAME'),
            tag=version,
            branch_name=os.getenv('CIRCLE_BRANCH'),
            release_asset=asset,
            release_asset_type='application/x-gzip',
            deploy_env='staging',
        )
