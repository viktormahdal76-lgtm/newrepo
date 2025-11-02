# Database Setup for Real-Time Chat

## Required SQL Commands

Run these commands in your Supabase SQL Editor to set up the chat functionality:

### 1. Create Messages Table

```sql
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### 2. Create Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
```

### 3. Enable Row Level Security

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### 4. Create RLS Policies

```sql
-- Users can read messages they sent or received
CREATE POLICY "Users can read their own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Users can insert messages they are sending
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

-- Users can update read_at on messages they received
CREATE POLICY "Users can mark messages as read" ON messages
  FOR UPDATE USING (
    auth.uid() = receiver_id
  );
```

### 5. Enable Realtime

In Supabase Dashboard:
1. Go to Database → Replication
2. Enable replication for the `messages` table
3. This allows real-time subscriptions to work

## Features Implemented

✅ Real-time message delivery using Supabase Realtime
✅ Typing indicators via broadcast channels
✅ Read receipts (single check = sent, double check = read)
✅ Message history loading
✅ Unread message counts
✅ Chat previews with last message
✅ Auto-scroll to latest message
✅ Online status indicators

## How It Works

1. **Message Sending**: Messages are inserted into the `messages` table
2. **Real-time Updates**: Supabase Realtime broadcasts new messages to subscribers
3. **Typing Indicators**: Uses Supabase broadcast channels for ephemeral typing events
4. **Read Receipts**: Updates `read_at` timestamp when messages are viewed
5. **Chat Previews**: Queries latest message per conversation for the chat list
