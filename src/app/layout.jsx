import '../styles/globals.css';
import QueryProvider from '../providers/QueryProvider';
import ThemeProvider from '../providers/ThemeProvider';
import { AuthProvider } from '../providers/AuthProvider';
import FloatingSnackbar from '../components/layout/FloatingSnackbar';

export const metadata = {
  title: 'Invoiza',
  description: 'Admin panel for Invoiza management',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet" /> */}
      </head>
      <body style={{ fontFamily: "'Play', sans-serif" }}> 
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <FloatingSnackbar />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
