// frontend/src/app/api/branches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo parameters are required' },
        { status: 400 }
      );
    }

    const branches = await githubAPI.getBranches(owner, repo);
    
    const formattedBranches = branches.map(branch => ({
      name: branch.name,
      commit: branch.commit.sha,
      protected: branch.protected,
    }));

    return NextResponse.json(formattedBranches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}