import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Search } from 'lucide-react';

export const ChatFeature: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main flex items-center gap-3">
          <MessageCircle className="text-primary" size={32} />
          Mes Messages
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!selectedConversationId ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto pr-2 hide-scrollbar"
            >
              <ChatList onSelectConversation={setSelectedConversationId} />
            </motion.div>
          ) : (
            <motion.div
              key="window"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <ChatWindow 
                conversationId={selectedConversationId} 
                onBack={() => setSelectedConversationId(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
