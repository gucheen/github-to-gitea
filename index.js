import { Octokit } from '@octokit/rest'
import superagent from 'superagent'

// fill these below
const GITHUB_TOKEN = ''
const GITHUB_USERNAME = ''
const GITEA_TOKEN = ''
const GITEA_SERVER = ''

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
})

const currentGiteaRepos = await superagent.get(`${GITEA_SERVER}/api/v1/user/repos`)
    .set('Authorization', `token ${GITEA_TOKEN}`)
    .set('Accept', 'application/json')

const exists = currentGiteaRepos.body.map(repo => repo.name)

octokit.paginate(octokit.repos.listForAuthenticatedUser)
    .then(async res => {
        const all = res.filter(repo => !(repo.owner.login !== GITHUB_USERNAME || repo.fork || exists.includes(repo.name)))
            .map(repo => {
                console.log(`migrate ${repo.name}`)
                return superagent.post(`${GITEA_SERVER}/api/v1/repos/migrate`)
                    .set('Authorization', `token ${GITEA_TOKEN}`)
                    .send({
                        auth_token: GITHUB_TOKEN,
                        clone_addr: repo.clone_url,
                        description: repo.description,
                        issues: true,
                        labels: true,
                        pull_requests: true,
                        releases: true,
                        repo_name: repo.name,
                        service: 'github',
                        wiki: true,
                        private: repo.visibility !== 'public',
                    })
            })
        await Promise.allSettled(all)
        console.log('all migrations done')
    })
