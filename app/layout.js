export const metadata = {
  title: 'sunivideo',
  description: 'AI ile video üretim platformu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
