import { NextRequest, NextResponse } from 'next/server';
import { generateApplicationPitch } from '@/lib/ai/coverLetterGenerator';
import { calculateJobMatch } from '@/lib/matching/scoringEngine';
import { CandidateProfile, Job } from '@/types/job';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { job, profile }: { job: Job; profile: CandidateProfile } = body;

    if (!job || !profile) {
      return NextResponse.json(
        { success: false, error: 'Job and Profile are required' },
        { status: 400 }
      );
    }

    const match = calculateJobMatch(job, profile);
    const pitch = generateApplicationPitch(job, profile, match);

    return NextResponse.json({
      success: true,
      data: pitch
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate application pitch' },
      { status: 500 }
    );
  }
}
