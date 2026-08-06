import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../firebase';
import { handleFirestoreError, OperationType } from '../../../lib/firestoreErrorHandler';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, User, Phone, Video, MoreVertical } from 'lucide-react';
import { notifyNewMessage } from '../../../services/notifications';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: any;
}

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch messages
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'messages', false);
      setLoading(false);
    });

    // Fetch conversation details to get other user name
    const fetchConv = async () => {
      try {
        const convDoc = await getDoc(doc(db, 'conversations', conversationId));
        if (convDoc.exists()) {
          const data = convDoc.data();
          const otherId = data.participants.find((id: string) => id !== auth.currentUser?.uid);
          setOtherUser({ id: otherId, name: data.participantNames[otherId] });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `conversations/${conversationId}`);
      }
    };
    fetchConv().catch(console.error);

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    const msgText = newMessage.trim();
    setNewMessage('');

    try {
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: auth.currentUser.uid,
        text: msgText,
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: msgText,
        lastMessageTimestamp: serverTimestamp()
      });

      // Send SMS Notification to recipient
      if (otherUser?.id) {
        try {
          const otherUserDoc = await getDoc(doc(db, 'users', otherUser.id));
          if (otherUserDoc.exists()) {
            const otherUserData = otherUserDoc.data();
            if (otherUserData.phone) {
              // Get current user name
              const meDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
              const myName = meDoc.exists() ? meDoc.data().name : 'Un utilisateur';
              
              await notifyNewMessage(otherUserData.phone, myName);
            }
          }
        } catch (smsError) {
          console.error('Failed to send chat SMS notification:', smsError);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
              {otherUser?.name?.charAt(0) || '?'}
            </div>
            <div>
              <h4 className="font-bold text-text-main leading-tight">{otherUser?.name || 'Utilisateur'}</h4>
              <p className="text-[11px] text-green-500 font-medium">En ligne</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <Phone size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <Video size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] p-3.5 rounded-2xl text-[14px] shadow-sm ${
                isMe 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white text-text-main rounded-tl-none border border-gray-100'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 opacity-60 text-right ${isMe ? 'text-white' : 'text-gray-400'}`}>
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={(e) => sendMessage(e).catch(console.error)} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-[14px] focus:outline-none focus:border-primary transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!newMessage.trim()}
          className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          <Send size={20} />
        </motion.button>
      </form>
    </div>
  );
};
