import React from 'react';
import { CommanderChat } from '../../components/AIChat/CommanderChat';
import { MessageSquareHeart } from 'lucide-react';

export const VictimChatPage = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <MessageSquareHeart className="mr-3 text-red-400" />
          Emergency AI Assistant
        </h1>
        <p className="text-gray-400 mt-1">Get immediate guidance, report incidents, and request supplies.</p>
      </div>

      <div className="flex-1 h-[calc(100vh-180px)] max-w-4xl mx-auto w-full">
        <CommanderChat />
      </div>
    </div>
  );
};
