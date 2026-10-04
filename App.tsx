
import React, { useState, useEffect, useRef } from 'react';
import { ExamCard } from './components/ExamCard';
import { getApsetUpdates, askApsetQuestion } from './services/geminiService';
import { ChatMessage, ExamInfo } from './types';

const App: React.FC = () => {
  const [news, setNews] = useState<{ text: string; links: { title: string; url: string }[] } | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const result = await getApsetUpdates();
        setNews(result);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSending) return;

    const userMsg: ChatMessage = { role: 'user', text: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsSending(true);

    try {
      const response = await askApsetQuestion(userInput);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: response.text || "I couldn't find a specific answer to that.",
        links: response.links
      }]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: "Sorry, I encountered an error processing your request."
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const examDetails: ExamInfo[] = [
    {
      title: "Eligibility",
      icon: "fa-user-graduate",
      description: "Candidates with a Master's degree (minimum 55% for General, 50% for reserved categories) are eligible. There is no upper age limit for Assistant Professor positions."
    },
    {
      title: "Exam Pattern",
      icon: "fa-file-alt",
      description: "Two papers: Paper I (50 MCQs, General awareness/Teaching aptitude) and Paper II (100 MCQs, Subject-specific). Both are 2 hours each."
    },
    {
      title: "Validity",
      icon: "fa-certificate",
      description: "The APSET certificate is valid for a lifetime for the recruitment of Assistant Professors in universities and colleges of Andhra Pradesh."
    },
    {
      title: "Subjects",
      icon: "fa-book",
      description: "APSET is conducted in approximately 30 subjects ranging from Humanities and Social Sciences to Physical and Life Sciences."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">APSET<span className="text-blue-600">Hub</span></h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#eligibility" className="hover:text-blue-600 transition-colors">Eligibility</a>
            <a href="#pattern" className="hover:text-blue-600 transition-colors">Pattern</a>
            <a href="#latest" className="hover:text-blue-600 transition-colors">Latest Updates</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 rounded-full">
              State Eligibility Test - Andhra Pradesh
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Your Complete Guide to <br className="hidden md:block" />
              <span className="text-blue-600">APSET Success</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
              Find everything from eligibility criteria and exam patterns to the latest notifications and live help for your academic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <i className="fas fa-search"></i>
                Check Latest News
              </button>
              <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all">
                Download Brochure
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {examDetails.map((detail, idx) => (
                <ExamCard key={idx} info={detail} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Updates Section */}
        <section id="latest" className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3">
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Latest Live Updates</h2>
                <p className="text-slate-600 mb-6">Real-time information fetched from official sources and current news channels regarding the upcoming APSET sessions.</p>
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                  <i className="fas fa-info-circle mr-2"></i>
                  Note: Always verify with the official APSET website for the final notification details.
                </div>
              </div>
              <div className="md:w-2/3 w-full bg-slate-50 p-8 rounded-3xl border border-slate-100 min-h-[300px]">
                {loadingNews ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="text-slate-500 font-medium">Fetching official updates...</p>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 mb-6 leading-relaxed">
                      {news?.text}
                    </div>
                    {news?.links && news.links.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Sources & Useful Links:</h4>
                        <div className="flex flex-wrap gap-2">
                          {news.links.map((link, idx) => (
                            <a 
                              key={idx} 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all"
                            >
                              <i className="fas fa-external-link-alt"></i>
                              {link.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold mb-6">Confused about APSET? <br /><span className="text-blue-400">Ask our AI Assistant</span></h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Get instant answers about qualifying marks, subject choices, preparation tips, and more. Our assistant uses real-time search to stay updated.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-blue-400"></i>
                  <span>Real-time search grounding</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-blue-400"></i>
                  <span>Concise, verified answers</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-blue-400"></i>
                  <span>Direct links to official docs</span>
                </li>
              </ul>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-3xl h-[500px] flex flex-col shadow-2xl">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold">APSET AI Assistant</h3>
                    <p className="text-xs text-green-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      Always Updated
                    </p>
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-8">
                      <i className="fas fa-comments text-4xl mb-4 opacity-20"></i>
                      <p className="text-sm">Hello! Ask me anything about the Andhra Pradesh State Eligibility Test.</p>
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        <button 
                          onClick={() => setUserInput("What is the qualifying mark for APSET?")}
                          className="px-3 py-1 bg-slate-100 rounded-full text-xs hover:bg-slate-200 text-slate-600"
                        >
                          Qualifying Marks?
                        </button>
                        <button 
                          onClick={() => setUserInput("Who conducts APSET?")}
                          className="px-3 py-1 bg-slate-100 rounded-full text-xs hover:bg-slate-200 text-slate-600"
                        >
                          Conducted by?
                        </button>
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </div>
                        {msg.links && msg.links.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200/50">
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">Related Sources:</p>
                            <div className="space-y-1">
                              {msg.links.map((link, lIdx) => (
                                <a 
                                  key={lIdx} 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block text-[11px] text-blue-500 hover:underline truncate"
                                >
                                  {link.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about subjects, dates, fees..."
                    className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button 
                    disabled={isSending}
                    className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white text-[10px]"></i>
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">APSET<span className="text-blue-600">Hub</span></h1>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The most reliable independent resource for Andhra Pradesh State Eligibility Test candidates. 
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Previous Papers</a></li>
                <li><a href="#" className="hover:text-blue-600">Subject Syllabus</a></li>
                <li><a href="#" className="hover:text-blue-600">Mock Tests</a></li>
                <li><a href="#" className="hover:text-blue-600">Preparation Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Official Portal</a></li>
                <li><a href="#" className="hover:text-blue-600">UGC Guidelines</a></li>
                <li><a href="#" className="hover:text-blue-600">Exam Centers</a></li>
                <li><a href="#" className="hover:text-blue-600">Results Archive</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Contact & Help</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Support Desk</a></li>
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
            <p>© 2024 APSET Hub. Not affiliated with the official Andhra University or Government of Andhra Pradesh.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
