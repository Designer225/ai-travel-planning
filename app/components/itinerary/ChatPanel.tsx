'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button';
import { Sparkles, Search } from 'lucide-react';
import { TripPlan } from '@/types';
import { DestinationSearch } from './DestinationSearch';
import { Destination } from '@/data/destinations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  tripPlan: TripPlan | null;
  setTripPlan: (plan: TripPlan | null) => void;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi! I'm your AI travel planning assistant. I can help you:\n\nâœˆï¸ Discover amazing destinations\nðŸ“… Create day-by-day itineraries\nðŸ¨ Plan accommodations and logistics\nðŸ½ï¸ Find the best local experiences\n\nWhere would you like to go? Just tell me about your dream trip!",
  timestamp: new Date(),
};

export function ChatPanel({ tripPlan, setTripPlan }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDestinationSearch, setShowDestinationSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string): { response: string; updatePlan?: TripPlan } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Example: Planning a trip to Tokyo
    if ((lowerMessage.includes('tokyo') || lowerMessage.includes('japan')) && !tripPlan) {
      const plan: TripPlan = {
        destination: 'Tokyo, Japan',
        startDate: '2025-04-01',
        endDate: '2025-04-05',
        days: [
          {
            day: 1,
            date: 'April 1, 2025',
            title: 'Arrival & Shibuya Exploration',
            activities: [
              {
                id: '1',
                time: '14:00',
                title: 'Arrive at Narita Airport',
                description: 'Take the Narita Express to Shibuya Station (90 min, Â¥3,250)',
                category: 'transport',
              },
              {
                id: '2',
                time: '16:00',
                title: 'Check-in at Hotel',
                description: 'Hotel in Shibuya district',
                location: 'Shibuya',
                category: 'accommodation',
              },
              {
                id: '3',
                time: '18:00',
                title: 'Shibuya Crossing & Hachiko Statue',
                description: "Experience the world's busiest pedestrian crossing",
                location: 'Shibuya',
                category: 'activity',
              },
              {
                id: '4',
                time: '20:00',
                title: 'Dinner at Ichiran Ramen',
                description: 'Famous tonkotsu ramen in private booth',
                location: 'Shibuya',
                category: 'food',
              },
            ],
          },
          {
            day: 2,
            date: 'April 2, 2025',
            title: 'Traditional Tokyo - Asakusa & Ueno',
            activities: [
              {
                id: '5',
                time: '09:00',
                title: 'Visit Senso-ji Temple',
                description: "Tokyo's oldest temple with traditional shopping street",
                location: 'Asakusa',
                category: 'activity',
              },
              {
                id: '6',
                time: '12:00',
                title: 'Lunch at Nakamise Shopping Street',
                description: 'Try traditional snacks and street food',
                location: 'Asakusa',
                category: 'food',
              },
              {
                id: '7',
                time: '14:00',
                title: 'Ueno Park & Museums',
                description: 'Visit museums or enjoy cherry blossoms if in season',
                location: 'Ueno',
                category: 'activity',
              },
              {
                id: '8',
                time: '18:00',
                title: 'Explore Ameyoko Market',
                description: 'Bustling market street with food stalls',
                location: 'Ueno',
                category: 'activity',
              },
            ],
          },
          {
            day: 3,
            date: 'April 3, 2025',
            title: 'Modern Tokyo - Harajuku & Shinjuku',
            activities: [
              {
                id: '9',
                time: '10:00',
                title: 'Meiji Shrine',
                description: 'Peaceful Shinto shrine in forested area',
                location: 'Harajuku',
                category: 'activity',
              },
              {
                id: '10',
                time: '12:00',
                title: 'Takeshita Street Shopping',
                description: 'Trendy fashion and quirky shops',
                location: 'Harajuku',
                category: 'activity',
              },
              {
                id: '11',
                time: '15:00',
                title: 'teamLab Borderless',
                description: 'Immersive digital art museum',
                location: 'Odaiba',
                category: 'activity',
              },
              {
                id: '12',
                time: '19:00',
                title: 'Shinjuku Golden Gai',
                description: 'Tiny bars and izakayas in atmospheric alleyways',
                location: 'Shinjuku',
                category: 'food',
              },
            ],
          },
        ],
        budget: '$2,000 - $2,500',
        travelers: 1,
      };

      return {
        response: "Excellent choice! Tokyo is an incredible city that perfectly blends tradition and modernity. ðŸ‡¯ðŸ‡µ\n\nI've created a 3-day itinerary for you covering the best of Tokyo:\n\nðŸ“ Day 1: Arrival & Shibuya\nðŸ“ Day 2: Traditional Tokyo (Asakusa & Ueno)\nðŸ“ Day 3: Modern Tokyo (Harajuku & Shinjuku)\n\nYou can see the full day-by-day plan on the right. Would you like me to:\n- Add more days?\n- Focus on specific interests (food, culture, shopping)?\n- Adjust the pace?\n- Add day trips outside Tokyo?",
        updatePlan: plan,
      };
    }

    // Example: Planning Paris trip
    if ((lowerMessage.includes('paris') || lowerMessage.includes('france')) && !tripPlan) {
      const plan: TripPlan = {
        destination: 'Paris, France',
        startDate: '2025-05-15',
        endDate: '2025-05-19',
        days: [
          {
            day: 1,
            date: 'May 15, 2025',
            title: 'Iconic Paris - Eiffel Tower & Seine',
            activities: [
              {
                id: '1',
                time: '10:00',
                title: 'Eiffel Tower',
                description: 'Book tickets in advance, visit summit for best views',
                location: 'Champ de Mars',
                category: 'activity',
              },
              {
                id: '2',
                time: '13:00',
                title: 'Lunch at CafÃ© de l\'Homme',
                description: 'Restaurant with Eiffel Tower views',
                location: 'TrocadÃ©ro',
                category: 'food',
              },
              {
                id: '3',
                time: '15:00',
                title: 'Seine River Cruise',
                description: 'See Paris from the water',
                location: 'Seine River',
                category: 'activity',
              },
              {
                id: '4',
                time: '19:00',
                title: 'Dinner in Le Marais',
                description: 'Historic district with great restaurants',
                location: 'Le Marais',
                category: 'food',
              },
            ],
          },
          {
            day: 2,
            date: 'May 16, 2025',
            title: 'Art & Culture - Louvre & MusÃ©e d\'Orsay',
            activities: [
              {
                id: '5',
                time: '09:00',
                title: 'Louvre Museum',
                description: 'Book timed entry, see Mona Lisa early to avoid crowds',
                location: 'Louvre',
                category: 'activity',
              },
              {
                id: '6',
                time: '13:00',
                title: 'Lunch at CafÃ© Marly',
                description: 'Elegant cafÃ© overlooking Louvre courtyard',
                location: 'Louvre',
                category: 'food',
              },
              {
                id: '7',
                time: '15:00',
                title: 'MusÃ©e d\'Orsay',
                description: 'Impressionist masterpieces in beautiful train station',
                location: 'Left Bank',
                category: 'activity',
              },
              {
                id: '8',
                time: '18:00',
                title: 'Stroll Saint-Germain-des-PrÃ©s',
                description: 'Charming neighborhood with cafÃ©s and boutiques',
                location: 'Saint-Germain',
                category: 'activity',
              },
            ],
          },
          {
            day: 3,
            date: 'May 17, 2025',
            title: 'Montmartre & SacrÃ©-CÅ“ur',
            activities: [
              {
                id: '9',
                time: '10:00',
                title: 'SacrÃ©-CÅ“ur Basilica',
                description: 'Stunning white basilica with panoramic views',
                location: 'Montmartre',
                category: 'activity',
              },
              {
                id: '10',
                time: '12:00',
                title: 'Explore Montmartre Streets',
                description: 'Artists, cafÃ©s, and charming cobblestone streets',
                location: 'Montmartre',
                category: 'activity',
              },
              {
                id: '11',
                time: '14:00',
                title: 'Lunch at La Maison Rose',
                description: 'Instagram-famous pink cafÃ©',
                location: 'Montmartre',
                category: 'food',
              },
              {
                id: '12',
                time: '17:00',
                title: 'Moulin Rouge Show',
                description: 'Iconic cabaret performance (book in advance)',
                location: 'Pigalle',
                category: 'activity',
              },
            ],
          },
        ],
        budget: '$2,500 - $3,000',
        travelers: 2,
      };

      return {
        response: "Magnifique! Paris is the perfect destination for romance, art, and incredible food. ðŸ—¼\n\nI've created a 3-day itinerary covering Paris highlights:\n\nðŸ“ Day 1: Eiffel Tower & Seine River\nðŸ“ Day 2: World-class museums (Louvre & MusÃ©e d'Orsay)\nðŸ“ Day 3: Bohemian Montmartre\n\nCheck out the detailed itinerary on the right! Would you like to:\n- Add more days?\n- Include Versailles day trip?\n- Focus more on food experiences?\n- Add shopping locations?",
        updatePlan: plan,
      };
    }

    // Modify existing trip
    if (tripPlan && (lowerMessage.includes('add') || lowerMessage.includes('more day'))) {
      return {
        response: "I can add more days to your itinerary! What would you like to do on the additional day(s)? Some suggestions:\n\nâ€¢ Day trips to nearby areas\nâ€¢ More time in specific neighborhoods\nâ€¢ Special activities (cooking class, guided tour)\nâ€¢ Shopping and relaxation\n\nTell me what interests you!",
      };
    }

    // Start new trip
    if (lowerMessage.includes('new trip') || lowerMessage.includes('start over')) {
      return {
        response: "Let's plan a new trip! Where would you like to go?",
        updatePlan: null,
      };
    }

    // General destination inquiry
    if (lowerMessage.includes('where') || lowerMessage.includes('suggest') || lowerMessage.includes('recommend') || lowerMessage.includes('browse') || lowerMessage.includes('explore')) {
      return {
        response: "I'd love to help you find the perfect destination! You can:\n\nðŸ” Click 'Browse Destinations' to explore our curated collection with filters\nðŸ’¬ Tell me what you're looking for:\n  ðŸ–ï¸ Beach & relaxation\n  ðŸ”ï¸ Mountains & adventure\n  ðŸ›ï¸ History & culture\n  ðŸœ Food experiences\n  ðŸŒ† Urban exploration\n  ðŸ’° Budget-friendly or luxury\n\nWhat type of experience are you dreaming of?",
      };
    }

    // Budget questions
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return {
        response: tripPlan 
          ? `For your trip to ${tripPlan.destination}, here's a rough budget breakdown:\n\nðŸ’° Estimated: ${tripPlan.budget || '$2,000 - $3,000'}\n\nThis typically includes:\nâ€¢ Accommodation\nâ€¢ Food & dining\nâ€¢ Activities & attractions\nâ€¢ Local transportation\n\nWould you like me to adjust the itinerary for a different budget?`
          : "I can help you plan a trip for any budget! What's your budget range per person? I'll suggest destinations and create an itinerary that fits.",
      };
    }

    // Default response
    return {
      response: "I'm here to help you plan an amazing trip! You can ask me about:\n\nâœ¨ Destination recommendations\nðŸ“… Creating detailed itineraries\nðŸ’° Budget planning\nðŸ—ºï¸ Day-by-day activities\nðŸ¨ Accommodations and logistics\n\nWhat would you like to explore?",
    };
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const { response, updatePlan } = generateResponse(content);
    
    if (updatePlan !== undefined) {
      setTripPlan(updatePlan);
    }

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

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

    // Simulate AI response
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Create a basic trip plan
    const plan: TripPlan = {
      destination: `${destination.name}, ${destination.country}`,
      days: [],
      budget: `$${destination.averageBudgetPerDay.budget} - $${destination.averageBudgetPerDay.luxury}/day`,
      travelers: 1,
    };

    setTripPlan(plan);

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Great choice! ${destination.name} is ${destination.description}\n\nâœ¨ Highlights:\n${destination.highlights.slice(0, 5).map(h => `â€¢ ${h}`).join('\n')}\n\nðŸ“… Best time to visit: ${destination.bestMonths.map(m => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]).join(', ')}\nðŸ’° Budget: $${destination.averageBudgetPerDay.budget}-$${destination.averageBudgetPerDay.luxury}/day\nâ±ï¸ Ideal duration: ${destination.idealDuration} days\n\nI'm ready to create a detailed itinerary! How many days would you like to spend in ${destination.name}?`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  return (
    <>
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg">Chat with AI</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDestinationSearch(true)}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            Browse Destinations
          </Button>
        </div>
        <p className="text-sm text-gray-600">Describe your dream trip and I'll plan it for you</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

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
