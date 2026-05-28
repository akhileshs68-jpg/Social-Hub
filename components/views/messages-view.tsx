"use client"

import { useState } from "react"
import { ConversationsList } from "@/components/conversations-list"
import { ChatInterface } from "@/components/chat-interface"
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
import { ChatProvider } from "@/contexts/chat-context"
import type { Conversation } from "@/lib/types"

function MessagesContent() {
<<<<<<< HEAD
=======
=======
import type { Conversation } from "@/lib/types"

export function MessagesView() {
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  return (
    <div className="h-[calc(100vh-8rem)] max-w-2xl mx-auto bg-background rounded-lg overflow-hidden border border-border shadow-sm">
      {selectedConversation ? (
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
        <ChatInterface
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
<<<<<<< HEAD
      ) : (
        <ConversationsList
          onSelectConversation={setSelectedConversation}
          selectedConversationId={undefined}
=======
=======
        <ChatInterface conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
      ) : (
        <ConversationsList
          onSelectConversation={setSelectedConversation}
          selectedConversationId={selectedConversation?.id}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
        />
      )}
    </div>
  )
}
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046

export function MessagesView() {
  return (
    <ChatProvider>
      <MessagesContent />
    </ChatProvider>
  )
}
<<<<<<< HEAD
=======
=======
>>>>>>> 82bc3ca8b44839ba49ec0fc525fcb6c408caf7eb
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
