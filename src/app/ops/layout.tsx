import '../globals.css';

export const metadata = {
  title: 'MUGOONG OPS – Management Platform',
  description: 'Mugoong 통합 경영관리 플랫폼',
  robots: { index: false, follow: false },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}
      >
        {children}
      </body>
    </html>
  );
}
