import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BriefcaseIcon, LightbulbIcon, UsersIcon, ChartPieIcon, BanknotesIcon, Cog6ToothIcon, CalculatorIcon, DatabaseIcon, Squares2X2Icon, NewspaperIcon, ShareIcon } from '../components/icons';
import { AboutUsIcon, Stock } from '../types';
import Modal from '../components/Modal';

const carouselImages = [
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2815&auto=format&fit=crop',
];

const iconMap: Record<AboutUsIcon, React.ReactNode> = {
  LightbulbIcon: <LightbulbIcon />,
  UsersIcon: <UsersIcon />,
  BriefcaseIcon: <BriefcaseIcon />,
  ChartPieIcon: <ChartPieIcon />,
  BanknotesIcon: <BanknotesIcon />,
  Cog6ToothIcon: <Cog6ToothIcon />,
  CalculatorIcon: <CalculatorIcon />,
  DatabaseIcon: <DatabaseIcon />,
  Squares2X2Icon: <Squares2X2Icon />,
};

const iconColorMap: Record<AboutUsIcon, string> = {
  LightbulbIcon: 'bg-indigo-100 text-indigo-700',
  UsersIcon: 'bg-green-100 text-green-700',
  BriefcaseIcon: 'bg-purple-100 text-purple-700',
  ChartPieIcon: 'bg-blue-100 text-blue-700',
  BanknotesIcon: 'bg-amber-100 text-amber-700',
  Cog6ToothIcon: 'bg-green-100 text-green-700',
  CalculatorIcon: 'bg-purple-100 text-purple-700',
  DatabaseIcon: 'bg-indigo-100 text-indigo-700',
  Squares2X2Icon: 'bg-pink-100 text-pink-700',
}

const TradingViewChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Map mock tickers to real ones for the demo
    const tickerMap: Record<string, string> = {
      'TGC': 'NASDAQ:AAPL',
      'GES': 'NASDAQ:ICLN',
      'GFB': 'NYSE:JPM',
      'FAI': 'NASDAQ:TSLA',
    };

    const realSymbol = tickerMap[symbol] || (symbol.includes(':') ? symbol : `NASDAQ:${symbol}`);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": realSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com",
      "container_id": "tradingview_chart_container"
    });
    
    if (container.current) {
        container.current.innerHTML = '';
        const widgetDiv = document.createElement('div');
        widgetDiv.id = 'tradingview_chart_container';
        widgetDiv.className = 'h-full w-full';
        container.current.appendChild(widgetDiv);
        container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
    </div>
  );
};

const DemoReportModal: React.FC<{ stock: Stock; onClose: () => void }> = ({ stock, onClose }) => {
    const [copied, setCopied] = useState(false);
    const upside = ((stock.targetPrice - stock.currentPrice) / stock.currentPrice) * 100;
    const priceLeft = Math.max(0, stock.targetPrice - stock.currentPrice);
    
    // Automatic Link Generation Logic
    const tradingViewUrl = stock.tradingViewLink || `https://www.tradingview.com/symbols/${stock.ticker.toUpperCase()}/`;
    
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Modal title={`Equity Research Report: ${stock.name}`} onClose={onClose}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <img src={stock.imageUrl} alt={stock.name} className="w-full md:w-1/3 object-cover rounded-2xl h-48 shadow-lg border-4 border-white" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stock.name}</h3>
                                <span className="inline-block bg-slate-900 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] mt-2">{stock.ticker}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">current price -</p>
                                <p className="text-3xl font-black text-blue-700">{stock.currency}{stock.currentPrice}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                             <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">target price -</p>
                                <p className="text-lg font-black text-slate-900">{stock.currency}{stock.targetPrice}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">intrinsic value -</p>
                                <p className="text-lg font-black text-purple-700">{stock.currency}{stock.intrinsicValue}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">price left -</p>
                                <p className="text-lg font-black text-green-600">{stock.currency}{priceLeft.toFixed(2)}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">potential -</p>
                                <p className="text-lg font-black text-amber-600">{upside > 0 ? '+' : ''}{upside.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
                    >
                        <ShareIcon className="w-4 h-4" />
                        {copied ? 'Link Copied!' : 'Share Analysis Link'}
                    </button>
                </div>

                {/* Technical Analysis Action Section - Embedded Terminal */}
                <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative group">
                    <div className="bg-slate-900/50 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                            </div>
                            <div className="h-4 w-px bg-slate-800 mx-1"></div>
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <ChartPieIcon className="w-3 h-3" /> technical terminal // {stock.ticker}
                            </h4>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Live Data Stream</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        </div>
                    </div>
                    
                    <div className="h-[500px] w-full bg-slate-950">
                        <TradingViewChart symbol={stock.ticker} />
                    </div>

                    <div className="p-4 bg-slate-900/30 border-t border-slate-800 flex justify-between items-center">
                        <p className="text-[10px] text-slate-500 font-medium">Professional grade technical analysis powered by TradingView</p>
                        <a 
                            href={tradingViewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                        >
                            Open in Full Screen &rarr;
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h4 className="text-xl font-black text-slate-900 mb-4 border-b-2 border-slate-100 pb-2">Investment Thesis</h4>
                        <div className="text-slate-600 leading-relaxed text-sm bg-white p-6 rounded-2xl border border-slate-100 shadow-sm whitespace-pre-wrap">
                            {stock.description}
                        </div>
                        
                        {stock.newsLink && (
                             <div className="mt-6 p-5 bg-yellow-50 rounded-2xl border-2 border-yellow-200 shadow-sm">
                                <h5 className="text-[10px] font-black text-yellow-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <NewspaperIcon className="w-4 h-4" /> latest News -
                                </h5>
                                <a href={stock.newsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-800 font-black hover:underline underline-offset-4 decoration-yellow-600 decoration-2">
                                    Click here for latest market developments for {stock.name} &rarr;
                                </a>
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-slate-900 mb-4 border-b-2 border-slate-100 pb-2">Key Ratios</h4>
                         <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white space-y-4">
                             {stock.ratios.split('\n').filter(r => r.trim()).map((ratio, i) => (
                                 <div key={i} className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{ratio.includes(':') ? ratio.split(':')[0] : ratio}</span>
                                     <span className="font-mono font-bold text-blue-400">{ratio.includes(':') ? ratio.split(':')[1] : ''}</span>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-3xl text-center text-white shadow-2xl transform hover:scale-[1.01] transition-transform">
                    <p className="font-black text-xl mb-4 tracking-tight">Unlock Professional Equity Research Reports</p>
                    <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">Get access to our complete valuation models, sector outlooks, and private client analyst notes.</p>
                    <Link to="/client-register" className="inline-block bg-white text-blue-900 font-black px-10 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl">
                        Become a Client & View Full Analysis
                    </Link>
                </div>
            </div>
        </Modal>
    );
}

const HomePage: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentAboutImageIndex, setCurrentAboutImageIndex] = useState(0);
    const { stocks, aboutUsContent, news, services, slideshowImages } = useAuth();
    const [selectedDemoStock, setSelectedDemoStock] = useState<Stock | null>(null);

    const activeStocks = stocks.filter(s => !s.isDeleted);
    const activeNews = news.filter(n => !n.isDeleted).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
    const activeServices = services.filter(s => !s.isDeleted);
    const activeSlideshow = slideshowImages.filter(img => !img.isDeleted);

    useEffect(() => {
        if (activeSlideshow.length > 1) {
            const heroTimer = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeSlideshow.length);
            }, 3500);
            return () => clearInterval(heroTimer);
        }
    }, [activeSlideshow.length]);

    useEffect(() => {
        if (aboutUsContent.mainImages.length > 1) {
            const aboutTimer = setInterval(() => {
                setCurrentAboutImageIndex(prevIndex => (prevIndex + 1) % aboutUsContent.mainImages.length);
            }, 4000);
            return () => clearInterval(aboutTimer);
        }
    }, [aboutUsContent.mainImages]);

  return (
    <>
      {selectedDemoStock && <DemoReportModal stock={selectedDemoStock} onClose={() => setSelectedDemoStock(null)} />}

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {activeSlideshow.map((img) => (
            <div
              key={img.id}
              className="min-w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${img.url})` }}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-blue-900/40"></div>
        
        {/* Moving Taglines Bar */}
        <div className="absolute top-0 left-0 w-full bg-slate-900/60 backdrop-blur-md py-3 overflow-hidden border-b border-white/10 z-20">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-16 px-8">
                <span className="text-[10px] font-black tracking-[0.4em] bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase">Global Financial Advisory</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span className="text-[10px] font-black tracking-[0.4em] bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase">Corporate Strategy</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span className="text-[10px] font-black tracking-[0.4em] bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase">Investment Banking</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span className="text-[10px] font-black tracking-[0.4em] bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase">Equity Research</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
                <span className="text-[10px] font-black tracking-[0.4em] bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase">Wealth Management</span>
                <span className="w-1 h-1 rounded-full bg-white/30"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-white">
          <h1 className="text-4xl md:text-7xl font-black leading-tight uppercase tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            BELREON
          </h1>
          <div className="mt-2 flex flex-col items-center">
            <p className="text-sm md:text-xl font-bold text-slate-100 uppercase tracking-[0.3em] drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] pb-1 inline-block">
              Simplifying Finance for Every Business
            </p>
          </div>
          <div className="h-24 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold mt-4 animate-slide-in-from-right drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {activeSlideshow[currentImageIndex]?.title || 'Expert Financial Advisory'}
            </h2>
            <p className="mt-2 text-lg text-slate-300 max-w-3xl mx-auto italic drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
                {activeSlideshow[currentImageIndex]?.subtitle || 'Navigate your business growth with clarity.'}
            </p>
          </div>
          <div className="mt-12">
            <Link to="/client-register" className="inline-block bg-blue-700 text-white font-black px-10 py-4 rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-2xl transform hover:-translate-y-1 uppercase tracking-widest">
              Start Your Portfolio &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Our Professional Services</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              We provide high-end financial consultancy tailored to your business needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service) => (
              <div key={service.id} className="bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${iconColorMap[service.icon]}`}>
                    {iconMap[service.icon]}
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stock Recommendations Section */}
      <section id="stocks" className="py-20 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Our Current Top Picks</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Fundamental picks curated by our experts, calculated against real-world intrinsic value.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeStocks.map((stock, index) => {
               return (
                  <div key={stock.id} className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col opacity-0 animate-slide-in-from-right group relative" style={{ animationDelay: `${index * 100}ms` }}>
                    {stock.isDemo && (
                        <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 z-20 rounded-br-lg uppercase">SAMPLE REPORT</div>
                    )}
                    <div className="h-40 overflow-hidden relative">
                        <img src={stock.imageUrl} alt={stock.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-[10px] font-bold px-2 py-1 rounded">
                            {stock.ticker}
                        </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">{stock.name}</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-2">Current Market Price</p>
                        <p className="text-2xl font-bold text-slate-900">{stock.currency}{stock.currentPrice}</p>
                        <div className="flex justify-between items-center text-xs mt-4 pt-3 border-t border-slate-100">
                             <div className="text-left">
                                <span className="block text-slate-400 uppercase font-bold text-[9px]">Target</span>
                                <span className="font-bold text-slate-700">{stock.currency}{stock.targetPrice}</span>
                            </div>
                             <div className="text-right">
                                <span className="block text-slate-400 uppercase font-bold text-[9px]">Intrinsic</span>
                                <span className="font-bold text-purple-600">{stock.currency}{stock.intrinsicValue}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                        {stock.isDemo ? (
                             <button onClick={() => setSelectedDemoStock(stock)} className="block w-full text-center py-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 font-bold hover:bg-yellow-100 transition-colors text-xs">
                                Open Sample Analysis
                             </button>
                        ) : (
                             <Link to="/client-register" className="block w-full text-center py-2 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors text-xs shadow-md">
                                Full Premium Analysis
                             </Link>
                        )}
                    </div>
                  </div>
               );
            })}
          </div>
        </div>
      </section>

      {/* Market News Section */}
      <section id="news" className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-12">
                <div className="flex items-center gap-2 mb-2">
                    <NewspaperIcon className="text-yellow-600 w-8 h-8" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Global Market Insights</h2>
                </div>
                <p className="text-slate-600 max-w-2xl text-center">Stay informed with real-time news and macro research updates.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {activeNews.map(item => (
                    <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                        <div className="h-44 overflow-hidden relative">
                             {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400"><NewspaperIcon className="w-10 h-10" /></div>
                            )}
                            <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 uppercase">{item.date}</div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors">{item.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{item.summary}</p>
                            {item.url ? (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-700 font-bold text-xs hover:underline mt-auto">READ FULL STORY &rarr;</a>
                            ) : (
                                <span className="text-slate-400 text-[10px] uppercase font-bold mt-auto tracking-widest">Team Report</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Why Choose BELREON?</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Expertise that bridges the gap between speculation and data-driven wealth creation.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-xl shadow-2xl w-full aspect-[3/2] overflow-hidden border-8 border-white">
               {aboutUsContent.mainImages.map((src, index) => (
                <img 
                    key={index}
                    src={src} 
                    alt={`About ${index + 1}`} 
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentAboutImageIndex ? 'opacity-100' : 'opacity-0'}`}
                />
                ))}
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-800">{aboutUsContent.heading}</h3>
              <p className="mt-4 text-slate-600 leading-relaxed text-sm">{aboutUsContent.paragraph}</p>
              <div className="mt-8 space-y-6">
                {aboutUsContent.features.filter(f => !f.isDeleted).map((feature, index) => (
                  <div key={index} className="flex items-start group">
                    <div className={`flex-shrink-0 p-3 rounded-xl transition-transform group-hover:scale-110 ${iconColorMap[feature.icon]}`}>
                      {iconMap[feature.icon]}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-slate-800">{feature.title}</h4>
                      <p className="mt-1 text-slate-500 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;