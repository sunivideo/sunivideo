import './globals.css';

export const metadata = {
  title: 'sunivideo — Videon 60 saniyede hazır',
  description: 'Tek bir cümle yaz, konuşan karakterinin videosunu saniyeler içinde üret.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
