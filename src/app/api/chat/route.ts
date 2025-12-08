import { NextRequest, NextResponse } from 'next/server';
import { chatMessages, addChatMessage, getChatHistory, markMessagesAsRead } from '@/data/storage';
import { sanitizeString } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const messages = getChatHistory(userId || undefined);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, userName, message, isAdmin } = data;

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!userName || userName.trim().length === 0) {
      return NextResponse.json(
        { error: 'User name is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedMessage = sanitizeString(message).substring(0, 500);
    const sanitizedUserName = sanitizeString(userName).substring(0, 100);

    addChatMessage({
      userId,
      userName: sanitizedUserName,
      message: sanitizedMessage,
      isAdmin: isAdmin || false,
      read: false,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const { messageIds } = data;

    if (!Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'messageIds must be an array' },
        { status: 400 }
      );
    }

    markMessagesAsRead(messageIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
