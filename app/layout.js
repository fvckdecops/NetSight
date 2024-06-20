import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";
import { cn } from "@/lib/utils";
import 'air-datepicker/air-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import 'mapbox-gl/dist/mapbox-gl.css';

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
	const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased")}>
        <SessionProvider session={session}>
          <ReactQueryClientProvider>
              {children}
          </ReactQueryClientProvider>
        </SessionProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}