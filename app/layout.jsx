import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider"
import { authOptions } from "./api/auth/[...nextauth]/route"
import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";
import { cn } from "@/lib/utils";
import 'react-toastify/dist/ReactToastify.css';
import 'rsuite/DateRangePicker/styles/index.css';
import { ToastContainer } from "react-toastify";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
	const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased")}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_SecretKey}
        >
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
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
