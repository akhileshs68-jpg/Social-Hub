"use client"

import { useState } from "react"
import { ConversationsList } from "@/components/conversations-list"
import { ChatInterface } from "@/components/chat-interface"
import { ChatProvider } from "@/contexts/chat-context"
import type { Conversation } from "@/lib/types"

function MessagesContent() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  return (
    <div className="h-[calc(100vh-8rem)] max-w-2xl mx-auto bg-background rounded-lg overflow-hidden border border-border shadow-sm">
      {selectedConversation ? (
        <ChatInterface
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      ) : (
        <ConversationsList
          onSelectConversation={setSelectedConversation}
          selectedConversationId={undefined}
        />
      )}
    </div>
  )
}

export function MessagesView() {
  return (
    <ChatProvider>
      <MessagesContent />
    </ChatProvider>
  )
}
