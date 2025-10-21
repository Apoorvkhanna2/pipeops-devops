// frontend/src/app/api/deployments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner') || process.env.GITHUB_OWNER;
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo parameters are required' },
        { status: 400 }
      );
    }

    const deployments = await githubAPI.getDeployments(owner, repo);
    
    // Enhance deployments with status and commit info
    const enhancedDeployments = await Promise.all(
      deployments.map(async (deployment) => {
        try {
          const statuses = await githubAPI.getDeploymentStatuses(owner, repo, deployment.id);
          const latestStatus = statuses[0];
          const commit = await githubAPI.getCommit(owner, repo, deployment.sha);

          return {
            id: deployment.id.toString(),
            repo: `${owner}/${repo}`,
            branch: deployment.ref.replace('refs/heads/', ''),
            status: latestStatus?.state || 'pending',
            environment: deployment.environment,
            created_at: deployment.created_at,
            updated_at: deployment.updated_at,
            commit: {
              sha: deployment.sha.substring(0, 7),
              message: commit.commit.message,
              author: commit.commit.author.name,
              avatar_url: commit.author?.avatar_url,
            },
            deployment_url: `https://github.com/${owner}/${repo}/deployments/${deployment.id}`,
            github_data: deployment,
          };
        } catch (error) {
          console.error('Error enhancing deployment:', error);
          return null;
        }
      })
    );

    return NextResponse.json(
      enhancedDeployments.filter(Boolean)
    );
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { owner, repo, branch, environment, description } = body;

    if (!owner || !repo || !branch) {
      return NextResponse.json(
        { error: 'Owner, repo, and branch are required' },
        { status: 400 }
      );
    }

    const deployment = await githubAPI.createDeployment(
      owner,
      repo,
      branch,
      environment || 'production',
      description || 'Deployment from PipeOps'
    );

    return NextResponse.json({
      id: deployment.id.toString(),
      repo: `${owner}/${repo}`,
      branch: branch,
      status: 'pending',
      environment: environment || 'production',
      created_at: deployment.created_at,
      updated_at: deployment.updated_at,
      commit: {
        sha: deployment.sha.substring(0, 7),
        message: 'Deployment in progress...',
        author: deployment.creator.login,
      },
      deployment_url: `https://github.com/${owner}/${repo}/deployments/${deployment.id}`,
    });
  } catch (error: any) {
    console.error('Error creating deployment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create deployment' },
      { status: 500 }
    );
  }
}