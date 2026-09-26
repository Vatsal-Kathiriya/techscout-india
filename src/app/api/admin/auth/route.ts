import { NextResponse } from 'next/server';
import { validateAdminPassword, createAdminToken, isRequestAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Check current owner authentication state
export async function GET(req: Request) {
  const authorized = isRequestAuthorized(req);
  return NextResponse.json({ authenticated: authorized });
}

// POST: Authenticate owner with passkey
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || !validateAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid owner authentication key.' },
        { status: 401 }
      );
    }

    const token = createAdminToken();

    const response = NextResponse.json({
      success: true,
      message: 'Owner authenticated successfully.',
    });

    // Set secure HTTP-only session cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 3600, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Sign out / clear owner session
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out successfully.',
  });

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response;
}
