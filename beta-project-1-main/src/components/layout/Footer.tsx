import React from 'react';

interface FooterProps {
    companyName?: string;
    year?: number;
}

const Footer: React.FC<FooterProps> = ({
    companyName = 'Weather Guard',
    year = new Date().getFullYear()
}) => {
    return (
        <footer className="glass-nav text-gray-300 py-12 px-4 mt-16 border-t">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">About</h4>
                        <ul className="space-y-2">
                            <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                            <li><a href="#mission" className="hover:text-emerald-400 transition-colors">Our Mission</a></li>
                            <li><a href="#team" className="hover:text-emerald-400 transition-colors">Team</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="#docs" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                            <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
                            <li><a href="#api" className="hover:text-emerald-400 transition-colors">API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#terms" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Follow Us</h4>
                        <div className="flex gap-3">
                            <a
                                href="#twitter"
                                aria-label="Twitter"
                                className="px-3 py-1.5 bg-emerald-500 bg-opacity-10 rounded hover:bg-emerald-400 hover:text-slate-900 transition-all"
                            >
                                Twitter
                            </a>
                            <a
                                href="#github"
                                aria-label="GitHub"
                                className="px-3 py-1.5 bg-emerald-500 bg-opacity-10 rounded hover:bg-emerald-400 hover:text-slate-900 transition-all"
                            >
                                GitHub
                            </a>
                            <a
                                href="#linkedin"
                                aria-label="LinkedIn"
                                className="px-3 py-1.5 bg-emerald-500 bg-opacity-10 rounded hover:bg-emerald-400 hover:text-slate-900 transition-all"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
                    <p>&copy; {year} {companyName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
