import { CandidatesProvider } from "@/app/candidates";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CandidatesProvider>{children}</CandidatesProvider>
      </body>
    </html>
  );
}
