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
  LightbulbIcon: 'bg-blue-100 text-blue-700',
  UsersIcon: 'bg-green-100 text-green-700',
  BriefcaseIcon: 'bg-purple-100 text-purple-700',
  ChartPieIcon: 'bg-amber-100 text-amber-700',
  BanknotesIcon: 'bg-cyan-100 text-cyan-700',
  Cog6ToothIcon: 'bg-slate-100 text-slate-700',
  CalculatorIcon: 'bg-red-100 text-red-700',
  DatabaseIcon: 'bg-indigo-100 text-indigo-700',
  Squares2X2Icon: 'bg-pink-100 text-pink-700',
}

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

                {/* Technical Analysis Action Section - Now Always Automatic */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <ChartPieIcon /> automatic technical analysis -
                    </h4>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="max-w-md">
                            <p className="text-white font-bold text-lg mb-2 leading-tight">View Full Market Technicals on TradingView</p>
                            <p className="text-slate-400 text-sm">We provide direct access to real-time price action, trend indicators, and technical charts for <span className="text-blue-400 font-black">{stock.ticker}</span>.</p>
                        </div>
                        <a 
                            href={tradingViewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center bg-blue-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/25 whitespace-nowrap active:scale-95 group-hover:translate-x-1"
                        >
                            GO TO TRADINGVIEW &rarr;
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
    const { stocks, aboutUsContent, news } = useAuth();
    const [selectedDemoStock, setSelectedDemoStock] = useState<Stock | null>(null);

    const activeStocks = stocks.filter(s => !s.isDeleted);
    const activeNews = news.filter(n => !n.isDeleted).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

    useEffect(() => {
        const heroTimer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(heroTimer);
    }, []);

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
      <section className="relative h-[500px] flex items-center justify-center text-center overflow-hidden">
        {carouselImages.map((src, index) => (
          <div
            key={src}
            className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60"></div>
        <div className="relative z-10 container mx-auto px-6 text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Smart <span className="text-yellow-500">Investment Analysis</span> & Stock Recommendations
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto">
            Belreon provides deep-dive equity research and intrinsic valuation models to help you outperform the market.
          </p>
          <div className="mt-8">
            <Link to="/client-register" className="inline-block bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              Start Your Portfolio &rarr;
            </Link>
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Why Choose Belreon?</h2>
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