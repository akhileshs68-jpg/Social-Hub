"use client"

import { useState } from "react"
import { ConversationsList } from "@/components/conversations-list"
import { ChatInterface } from "@/components/chat-interface"
<<<<<<< HEAD
import { ChatProvider } from "@/contexts/chat-context"
import type { Conversation } from "@/lib/types"

function MessagesContent() {
=======
import type { Conversation } from "@/lib/types"

export function MessagesView() {
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  return (
    <div className="h-[calc(100vh-8rem)] max-w-2xl mx-auto bg-background rounded-lg overflow-hidden border border-border shadow-sm">
      {selectedConversation ? (
<<<<<<< HEAD
        <ChatInterface
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
=======
        <ChatInterface conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
      ) : (
        <ConversationsList
          onSelectConversation={setSelectedConversation}
          selectedConversationId={selectedConversation?.id}
        />
      )}
    </div>
  )
}
<<<<<<< HEAD

export function MessagesView() {
  return (
    <ChatProvider>
      <MessagesContent />
    </ChatProvider>
  )
}
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
