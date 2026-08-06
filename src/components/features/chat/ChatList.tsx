import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../../../../firebase';
import { handleFirestoreError, OperationType } from '../../../lib/firestoreErrorHandler';
import { motion } from 'motion/react';
import { User, MessageCircle, ChevronRight } from 'lucide-react';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: any;
  participantNames: { [key: string]: string };
}

interface ChatListProps {
  onSelectConversation: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('lastMessageTimestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
      setConversations(convs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'conversations', false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MessageCircle size={48} className="mb-4 opacity-20" />
        <p className="font-medium">Aucune conversation pour le moment</p>
        <p className="text-sm">Contactez un répétiteur pour commencer à discuter !</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conv) => {
        const otherId = conv.participants.find(id => id !== auth.currentUser?.uid);
        const otherName = otherId ? conv.participantNames[otherId] : 'Utilisateur';

        return (
          <motion.button
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {otherName.charAt(0)}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-text-main">{otherName}</h4>
                <p className="text-sm text-gray-500 truncate max-w-[200px]">{conv.lastMessage || 'Commencer la discussion...'}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300" size={20} />
          </motion.button>
        );
      })}
    </div>
  );
};
