'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import Button from '@mui/material/Button';
import { Sparkles, Search } from 'lucide-react';
import { TripPlan } from '@/types';
import { DestinationSearch } from './DestinationSearch';
import { Destination } from '@/data/destinations';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatPanelProps {
  tripPlan: TripPlan | null;
  setTripPlan: (plan: TripPlan | null) => void;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi! I'm your AI travel planning assistant. Where would you like to go? Just tell me about your dream trip and I'll create a personalized itinerary for you!",
  timestamp: new Date(),
};

export function ChatPanel({ tripPlan, setTripPlan }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDestinationSearch, setShowDestinationSearch] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change or typing state changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Memoize conversation history for API calls
  const conversationHistory = useMemo(() => {
    return messages
      .filter((msg) => msg.role !== 'user' || msg.content !== INITIAL_MESSAGE.content)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: content,
          existingTripPlan: tripPlan,
          conversationHistory: conversationHistory.slice(-12), // Last 12 messages for richer context
        }),
      });

      const data = await response.json();

      if (!data.success) {
        // Show error toast with appropriate styling
        const errorMsg = data.responseText || 'Failed to generate response';
        toast.error(errorMsg, {
          duration: 5000,
        });
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: errorMsg,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
        return;
      }

      // Update trip plan ONLY if explicitly provided and valid
      // For general questions, tripPlan will be undefined/null, so we preserve the existing one
      if (data.tripPlan && data.tripPlan.days && data.tripPlan.days.length > 0) {
        setTripPlan(data.tripPlan);
      }
      // If tripPlan is not provided or is empty, keep the existing tripPlan unchanged

      // Generate follow-up suggestions based on context
      const suggestions = generateSuggestions(data.tripPlan, data.responseText, content);

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
        content: data.responseText,
      timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
    setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Error calling AI service:', error);
      
      // Determine error message based on error type
      let errorMessage = 'I encountered an unexpected error. Please try again.';
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'The request took too long. Please try again with a simpler request.';
      }
      
      toast.error(errorMessage, {
        duration: 5000,
      });
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
    setIsTyping(false);
    }
  };

  // Listen for messages from TripPanel example prompts
  useEffect(() => {
    const handleCustomMessage = (event: CustomEvent<{ message: string }>) => {
      if (event.detail?.message && !isTyping) {
        handleSendMessage(event.detail.message);
      }
    };

    window.addEventListener('chat-send-message', handleCustomMessage as EventListener);
    return () => {
      window.removeEventListener('chat-send-message', handleCustomMessage as EventListener);
    };
  }, [isTyping, tripPlan, conversationHistory]);

  /**
   * Generates contextual follow-up suggestions based on the conversation
   */
  function generateSuggestions(
    tripPlan: TripPlan | null | undefined,
    responseText: string,
    lastUserMessage: string
  ): string[] {
    const suggestions: string[] = [];
    const lowerResponse = responseText.toLowerCase();
    const lowerUserMessage = lastUserMessage.toLowerCase();

    // Detect trip type from activities and conversation
    const detectTripType = (): 'food' | 'adventure' | 'culture' | 'family' | 'romantic' | 'budget' | 'general' => {
      if (!tripPlan) return 'general';
      
      const allText = `${responseText} ${lastUserMessage}`.toLowerCase();
      const activities = tripPlan.days.flatMap(d => d.activities.map(a => a.title.toLowerCase()));
      const allActivityText = activities.join(' ');
      
      if (allText.includes('food') || allText.includes('restaurant') || allText.includes('culinary') || 
          allActivityText.includes('restaurant') || allActivityText.includes('food') || allActivityText.includes('dining')) {
        return 'food';
      }
      if (allText.includes('adventure') || allText.includes('outdoor') || allText.includes('hiking') || 
          allActivityText.includes('hiking') || allActivityText.includes('adventure')) {
        return 'adventure';
      }
      if (allText.includes('museum') || allText.includes('culture') || allText.includes('art') || 
          allActivityText.includes('museum') || allActivityText.includes('gallery')) {
        return 'culture';
      }
      if (allText.includes('family') || allText.includes('kid') || allText.includes('children')) {
        return 'family';
      }
      if (allText.includes('romantic') || allText.includes('couple') || allText.includes('honeymoon')) {
        return 'romantic';
      }
      if (allText.includes('budget') || allText.includes('cheap') || allText.includes('affordable')) {
        return 'budget';
      }
      return 'general';
    };

    const tripType = detectTripType();
    const destination = tripPlan?.destination || 'this destination';

    // If itinerary was just generated
    if (tripPlan && tripPlan.days.length > 0) {
      // Trip type-specific suggestions
      if (tripType === 'food') {
        suggestions.push(`Add a cooking class or food tour`);
        suggestions.push(`Find the best local markets`);
        suggestions.push(`Suggest more budget-friendly dining options`);
      } else if (tripType === 'adventure') {
        suggestions.push(`Add more outdoor activities`);
        suggestions.push(`Find hiking or nature trails`);
        suggestions.push(`Suggest adventure sports`);
      } else if (tripType === 'culture') {
        suggestions.push(`Add more museums and galleries`);
        suggestions.push(`Find cultural performances or shows`);
        suggestions.push(`Suggest historical sites`);
      } else if (tripType === 'family') {
        suggestions.push(`Add more kid-friendly activities`);
        suggestions.push(`Find family-friendly restaurants`);
        suggestions.push(`Suggest activities suitable for all ages`);
      } else if (tripType === 'romantic') {
        suggestions.push(`Add romantic dining experiences`);
        suggestions.push(`Find scenic spots for couples`);
        suggestions.push(`Suggest sunset or evening activities`);
      } else if (tripType === 'budget') {
        suggestions.push(`Find more free activities`);
        suggestions.push(`Suggest cheaper accommodation options`);
        suggestions.push(`Show cost breakdown by day`);
      } else {
        // General suggestions based on context
        const foodCount = tripPlan.days.reduce((sum, day) => 
          sum + day.activities.filter(a => a.category === 'food').length, 0
        );
        const activityCount = tripPlan.days.reduce((sum, day) => 
          sum + day.activities.filter(a => a.category === 'activity').length, 0
        );
        
        if (foodCount < 3) {
          suggestions.push(`Add more food experiences`);
        }
        if (activityCount < tripPlan.days.length * 2) {
          suggestions.push(`Add more activities`);
        }
        suggestions.push(`Make the itinerary more relaxed`);
      }

      // Destination-specific suggestions
      if (suggestions.length < 3) {
        suggestions.push(`Add a day trip near ${destination}`);
        if (suggestions.length < 3) {
          suggestions.push(`What's the weather like in ${destination}?`);
        }
      }

      // Budget-related suggestions if mentioned
      if (lowerResponse.includes('budget') || lowerResponse.includes('cost') || lowerUserMessage.includes('budget')) {
        if (!suggestions.some(s => s.toLowerCase().includes('budget'))) {
          suggestions[0] = `Make it more budget-friendly`;
        }
      }
    } else {
      // No itinerary yet - general suggestions
      if (lowerResponse.includes('destination') || lowerUserMessage.includes('visit') || lowerUserMessage.includes('go')) {
        suggestions.push(`Tell me more about this destination`);
        suggestions.push(`What's the best time to visit?`);
        suggestions.push(`What's the budget for this trip?`);
      } else {
        suggestions.push(`Plan a 5-day trip`);
        suggestions.push(`Create a romantic getaway`);
        suggestions.push(`Suggest budget-friendly destinations`);
      }
    }

    // Limit to 3 suggestions
    return suggestions.slice(0, 3);
  }

  const handleDestinationSelect = async (destination: Destination) => {
    setShowDestinationSearch(false);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `I want to visit ${destination.name}, ${destination.country}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      // Create a basic trip plan first
      const basicPlan: TripPlan = {
      destination: `${destination.name}, ${destination.country}`,
      days: [],
      budget: `$${destination.averageBudgetPerDay.budget} - $${destination.averageBudgetPerDay.luxury}/day`,
      travelers: 1,
    };

      setTripPlan(basicPlan);

      // Call AI to generate detailed itinerary
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: `Create a detailed ${destination.idealDuration}-day itinerary for ${destination.name}, ${destination.country}. Include information about: ${destination.highlights.slice(0, 3).join(', ')}. Best time to visit: ${destination.bestMonths.map(m => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]).join(', ')}.`,
          existingTripPlan: basicPlan,
          conversationHistory: conversationHistory.slice(-10),
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.tripPlan) {
          setTripPlan(data.tripPlan);
        }
        
        // Generate follow-up suggestions
        const suggestions = generateSuggestions(data.tripPlan, data.responseText, `I want to visit ${destination.name}, ${destination.country}`);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.responseText,
          timestamp: new Date(),
          suggestions: suggestions.length > 0 ? suggestions : undefined,
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // Fallback to basic response if AI fails
        const fallbackContent = `Great choice! ${destination.name} is ${destination.description}\n\n✨ Highlights:\n${destination.highlights.slice(0, 5).map(h => `• ${h}`).join('\n')}\n\n📅 Best time to visit: ${destination.bestMonths.map(m => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]).join(', ')}\n💰 Budget: $${destination.averageBudgetPerDay.budget}-$${destination.averageBudgetPerDay.luxury}/day\n⏱️ Ideal duration: ${destination.idealDuration} days\n\nI'm ready to create a detailed itinerary! How many days would you like to spend in ${destination.name}?`;
        const suggestions = generateSuggestions(null, fallbackContent, `I want to visit ${destination.name}, ${destination.country}`);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackContent,
          timestamp: new Date(),
          suggestions: suggestions.length > 0 ? suggestions : undefined,
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error: any) {
      console.error('Error calling AI service:', error);
      // Fallback response
      const basicPlan: TripPlan = {
        destination: `${destination.name}, ${destination.country}`,
        days: [],
        budget: `$${destination.averageBudgetPerDay.budget} - $${destination.averageBudgetPerDay.luxury}/day`,
        travelers: 1,
      };
      setTripPlan(basicPlan);
      const errorContent = `Great choice! ${destination.name} is ${destination.description}\n\n✨ Highlights:\n${destination.highlights.slice(0, 5).map(h => `• ${h}`).join('\n')}\n\n📅 Best time to visit: ${destination.bestMonths.map(m => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]).join(', ')}\n💰 Budget: $${destination.averageBudgetPerDay.budget}-$${destination.averageBudgetPerDay.luxury}/day\n⏱️ Ideal duration: ${destination.idealDuration} days\n\nI'm ready to create a detailed itinerary! How many days would you like to spend in ${destination.name}?`;
      const suggestions = generateSuggestions(basicPlan, errorContent, `I want to visit ${destination.name}, ${destination.country}`);

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
        content: errorContent,
      timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
    setMessages((prev) => [...prev, aiResponse]);
    } finally {
    setIsTyping(false);
    }
  };

  return (
    <>
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg">Chat with TripAI</h2>
          </div>
          <Button
            variant="outlined"
            onClick={() => setShowDestinationSearch(true)}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            Browse Destinations
          </Button>
        </div>
        <p className="text-sm text-gray-600">Describe your dream trip and I'll plan it for you</p>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="space-y-4 max-w-2xl">
          {messages.map((message, index) => (
            <div 
              key={message.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ 
                animationDelay: `${index * 50}ms`,
                animationDuration: '300ms'
              }}
            >
              <ChatMessage 
                message={message}
                onSuggestionClick={(suggestion) => {
                  if (!isTyping) {
                    handleSendMessage(suggestion);
                  }
                }}
              />
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="text-sm text-gray-500 mr-2">TripAI is thinking</span>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

      <div className="border-t p-4 bg-white">
        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>

      <DestinationSearch
        open={showDestinationSearch}
        onClose={() => setShowDestinationSearch(false)}
        onSelectDestination={handleDestinationSelect}
      />
    </>
  );
}



