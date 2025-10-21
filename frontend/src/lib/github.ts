// frontend/src/lib/github.ts
export interface GitHubDeployment {
  id: number;
  sha: string;
  ref: string;
  task: string;
  payload: any;
  environment: string;
  description: string;
  creator: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  statuses_url: string;
  repository_url: string;
}

export interface GitHubDeploymentStatus {
  id: number;
  state: 'pending' | 'success' | 'failure' | 'error' | 'inactive';
  description: string;
  environment: string;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  repo: string;
  branch: string;
  status: 'pending' | 'success' | 'failure' | 'in_progress' | 'queued';
  environment: string;
  created_at: string;
  updated_at: string;
  commit: {
    sha: string;
    message: string;
    author: string;
    avatar_url?: string;
  };
  deployment_url?: string;
  logs_url?: string;
  github_data?: GitHubDeployment;
}

class GitHubAPI {
  private baseURL = 'https://api.github.com';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async fetchGitHub(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createDeployment(
    owner: string,
    repo: string,
    ref: string,
    environment: string = 'production',
    description: string = 'Deployment from PipeOps'
  ): Promise<GitHubDeployment> {
    return this.fetchGitHub(`/repos/${owner}/${repo}/deployments`, {
      method: 'POST',
      body: JSON.stringify({
        ref,
        environment,
        auto_merge: false,
        required_contexts: [],
        description,
      }),
    });
  }

  async getDeployments(owner: string, repo: string): Promise<GitHubDeployment[]> {
    return this.fetchGitHub(`/repos/${owner}/${repo}/deployments?per_page=10`);
  }

  async getDeploymentStatuses(owner: string, repo: string, deploymentId: number): Promise<GitHubDeploymentStatus[]> {
    return this.fetchGitHub(`/repos/${owner}/${repo}/deployments/${deploymentId}/statuses`);
  }

  async getCommit(owner: string, repo: string, sha: string): Promise<any> {
    return this.fetchGitHub(`/repos/${owner}/${repo}/commits/${sha}`);
  }

  async getBranches(owner: string, repo: string): Promise<any[]> {
    return this.fetchGitHub(`/repos/${owner}/${repo}/branches`);
  }

  async getRepositories(): Promise<any[]> {
    return this.fetchGitHub('/user/repos?per_page=100&sort=updated');
  }
}

// Singleton instance
export const githubAPI = new GitHubAPI(process.env.GITHUB_ACCESS_TOKEN || '');