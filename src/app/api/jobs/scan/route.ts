import { NextRequest, NextResponse } from 'next/server';
import { runJobIngestionPipeline } from '@/lib/ingestion/liveIngestion';

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const result = await runJobIngestionPipeline();
    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      scanSummary: {
        timestamp: new Date().toISOString(),
        durationMs,
        sourcesChecked: result.sourcesScanned,
        rawJobsScanned: result.totalRawScanned,
        deduplicatedUniqueJobs: result.totalDeduplicated,
        message: `Scanned ${result.totalRawScanned} job listings across ${result.sourcesScanned.length} APIs/feeds. Deduplicated down to ${result.totalDeduplicated} unique tech opportunities.`
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Scan execution failed' },
      { status: 500 }
    );
  }
}
