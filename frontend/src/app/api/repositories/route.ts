// frontend/src/app/api/repositories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const repositories = await githubAPI.getRepositories();
    
    const formattedRepos = repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner.login,
      private: repo.private,
      html_url: repo.html_url,
      description: repo.description,
      default_branch: repo.default_branch,
    }));

    return NextResponse.json(formattedRepos);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}