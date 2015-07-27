import os
import json
import logging

from github3 import login


logging.basicConfig(level=logging.INFO)


def main(access_token, repo_owner, repo_name, tag, branch_name, release_asset, release_asset_type, prerelease=True, ):  # noqa
    gh = login(token=access_token)
    repo = gh.repository(repo_owner, repo_name)
    release = repo.create_release(tag, branch_name, prerelease=prerelease)
    release_asset_name = "{}__{}.tar.gz".format(release_asset.name, tag)
    release.upload_asset(release_asset_type, release_asset_name, release_asset)


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
            release_asset_type='application/x-gzip'
        )
