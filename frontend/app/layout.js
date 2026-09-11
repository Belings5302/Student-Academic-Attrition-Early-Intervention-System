import './globals.css';
import Navbar from './Navbar';

export const metadata = {
  title: 'Student Academic Attrition & Early Intervention System',
  description: 'AI-powered retention platform analyzing continuous assessment scores, attendance rates, and course load to proactively flag at-risk students before final examinations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
